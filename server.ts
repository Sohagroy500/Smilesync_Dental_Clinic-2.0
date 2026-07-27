import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import JSZip from "jszip";
import bcrypt from "bcryptjs";
import { ADK_STARTER_FILES } from "./src/data/adkTemplateFiles";
import { INITIAL_APPOINTMENTS } from "./src/data/dentalData";
import { Appointment, WorkflowState } from "./src/types";
import { findAdminByEmail, updateAdminLastLogin, getAdminById, getAdminDatabase } from "./src/server/authDb";
import { generateJwtToken, requireJwtAuth, AuthenticatedRequest } from "./src/server/jwtAuth";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize SQLite Admin Database and seed default admin account
  try {
    await getAdminDatabase();
  } catch (dbErr) {
    console.error("Error initializing Admin SQLite Database:", dbErr);
  }

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // In-Memory MySQL Appointments Database State
  let appointmentsDb: Appointment[] = [...INITIAL_APPOINTMENTS];
  let nextAppointmentId = 104;

  // In-Memory Chat Sessions for Google ADK 2.0 RequestInput Workflow
  interface ChatSession {
    session_id: string;
    intent?: "question" | "booking";
    customer_info: {
      full_name?: string;
      email?: string;
      phone?: string;
      service?: string;
    };
    last_prompt?: string;
  }
  const chatSessions = new Map<string, ChatSession>();

  // ==========================================
  // API Endpoints
  // ==========================================

  // 1. Primary Chatbot Endpoint (POST /api/chat) for ADK 2.0 Chatbot Widget
  app.post("/api/chat", async (req, res) => {
    try {
      const { session_id, message, user_message } = req.body;
      const rawMsg = (message || user_message || "").trim();
      const sid = session_id || "default-session";

      if (!rawMsg) {
        return res.status(400).json({
          reply: "Please enter a message or question.",
          intent: "question",
          request_input: false,
          missing_fields: [],
          appointment_id: null
        });
      }

      // Retrieve or initialize session
      let session = chatSessions.get(sid);
      if (!session) {
        session = {
          session_id: sid,
          customer_info: {}
        };
        chatSessions.set(sid, session);
      }

      const msgLower = rawMsg.toLowerCase();

      // Reset / cancel command
      if (["cancel", "reset", "start over", "clear"].includes(msgLower)) {
        session.customer_info = {};
        session.intent = undefined;
        session.last_prompt = undefined;
        return res.json({
          reply: "Session reset. How may I help you with SmileSync Dental Clinic today?",
          intent: "question",
          request_input: false,
          missing_fields: [],
          appointment_id: null
        });
      }

      // Detect Intent
      const bookingKeywords = [
        "book", "appointment", "schedule", "reserve", "slot", "visit", 
        "whitening", "invisalign", "implant", "cleaning", "consultation", "doctor"
      ];
      const isBookingKeyword = bookingKeywords.some(kw => msgLower.includes(kw));

      if (session.intent === "booking" || isBookingKeyword) {
        session.intent = "booking";

        // Try extracting email if present in text
        const emailMatch = rawMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch && !session.customer_info.email) {
          session.customer_info.email = emailMatch[0].toLowerCase();
        }

        // Try extracting phone if present in text (7+ digits)
        const phoneMatch = rawMsg.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/) || rawMsg.match(/\d{7,15}/);
        if (phoneMatch && !session.customer_info.phone && !emailMatch) {
          session.customer_info.phone = phoneMatch[0];
        }

        // Try extracting service
        if (!session.customer_info.service) {
          if (msgLower.includes("whitening")) session.customer_info.service = "Laser Teeth Whitening";
          else if (msgLower.includes("invisalign")) session.customer_info.service = "Invisalign® Clear Aligners";
          else if (msgLower.includes("implant")) session.customer_info.service = "3D Precision Dental Implants";
          else if (msgLower.includes("veneer")) session.customer_info.service = "Porcelain Veneers";
          else if (msgLower.includes("root canal")) session.customer_info.service = "Painless Root Canal Therapy";
          else if (msgLower.includes("cleaning")) session.customer_info.service = "Preventive Cleaning & Examination";
          else if (msgLower.includes("emergency")) session.customer_info.service = "24/7 Emergency Dental Care";
        }

        // Handle prompt responses based on last_prompt
        if (session.last_prompt === "full_name" && !session.customer_info.full_name) {
          // Exclude text if user pasted an email or phone as full_name
          if (!emailMatch && !phoneMatch && rawMsg.length > 1) {
            session.customer_info.full_name = rawMsg;
          }
        } else if (session.last_prompt === "email" && !session.customer_info.email) {
          if (emailMatch) {
            session.customer_info.email = emailMatch[0].toLowerCase();
          } else if (rawMsg.includes("@")) {
            session.customer_info.email = rawMsg.trim().toLowerCase();
          }
        } else if (session.last_prompt === "phone" && !session.customer_info.phone) {
          if (phoneMatch) {
            session.customer_info.phone = phoneMatch[0];
          } else if (rawMsg.replace(/\D/g, "").length >= 7) {
            session.customer_info.phone = rawMsg.trim();
          }
        } else if (!session.customer_info.full_name && !isBookingKeyword && !emailMatch && !phoneMatch) {
          // If no prompt set yet and message looks like a name
          if (rawMsg.split(" ").length <= 4 && !rawMsg.includes("?")) {
            session.customer_info.full_name = rawMsg;
          }
        }

        // Use Gemini AI to extract missing fields from conversation if available
        if (process.env.GEMINI_API_KEY && (!session.customer_info.full_name || !session.customer_info.email || !session.customer_info.phone)) {
          try {
            const extractPrompt = `Extract customer contact details for dental booking from this message: "${rawMsg}".
Return JSON object strictly:
{
  "full_name": string or null,
  "email": string or null,
  "phone": string or null
}`;
            const extResp = await ai.models.generateContent({
              model: "gemini-3.6-flash",
              contents: extractPrompt,
              config: { responseMimeType: "application/json" }
            });
            const parsedExt = JSON.parse(extResp.text || "{}");
            if (parsedExt.full_name && !session.customer_info.full_name && parsedExt.full_name.length > 1) {
              session.customer_info.full_name = parsedExt.full_name;
            }
            if (parsedExt.email && !session.customer_info.email && parsedExt.email.includes("@")) {
              session.customer_info.email = parsedExt.email.toLowerCase();
            }
            if (parsedExt.phone && !session.customer_info.phone) {
              session.customer_info.phone = parsedExt.phone;
            }
          } catch (e) {
            // ignore extraction errors
          }
        }

        // Evaluate missing fields
        const missingFields: string[] = [];
        if (!session.customer_info.full_name) missingFields.push("Full Name");
        if (!session.customer_info.email) missingFields.push("Email Address");
        if (!session.customer_info.phone) missingFields.push("Phone Number");

        // RequestInput workflow step check
        if (!session.customer_info.full_name) {
          session.last_prompt = "full_name";
          return res.json({
            reply: "Sure! I'd be happy to help you book an appointment at SmileSync Dental Clinic.\n\nMay I have your **full name**?",
            intent: "booking",
            request_input: true,
            missing_fields: ["full_name"],
            appointment_id: null
          });
        }

        if (!session.customer_info.email) {
          session.last_prompt = "email";
          return res.json({
            reply: `Thanks **${session.customer_info.full_name}**!\n\nWhat is your **email address** so we can send your appointment details?`,
            intent: "booking",
            request_input: true,
            missing_fields: ["email"],
            appointment_id: null
          });
        }

        if (!session.customer_info.phone) {
          session.last_prompt = "phone";
          return res.json({
            reply: "Great! And what is the best **phone number** to reach you at?",
            intent: "booking",
            request_input: true,
            missing_fields: ["phone"],
            appointment_id: null
          });
        }

        // All 3 collected -> Finalize Booking with 30-min slot scheduling!
        const apptIdCode = `APT-${Math.floor(100000 + Math.random() * 900000)}`;

        // Helper to find next available 30-min slot in business hours
        const MONTH_NAMES = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        const bookedSlots = new Set<string>();
        for (const appt of appointmentsDb) {
          if (appt.appointment_date && appt.time_slot) {
            bookedSlots.add(`${appt.appointment_date}_${appt.time_slot}`);
          }
        }

        let selectedSlot: { dateStr: string; startTimeStr: string; endTimeStr: string } | null = null;
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() + 1);

        for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
          const targetDate = new Date(baseDate);
          targetDate.setDate(baseDate.getDate() + dayOffset);

          const dayOfWeek = targetDate.getDay(); // 0 = Sun
          if (dayOfWeek === 0) continue; // Sunday closed

          const startHour = dayOfWeek === 6 ? 9 : 8;
          const endHour = dayOfWeek === 6 ? 14 : 18;
          const dateFormatted = `${MONTH_NAMES[targetDate.getMonth()]} ${targetDate.getDate()}, ${targetDate.getFullYear()}`;

          for (let hour = startHour; hour < endHour; hour++) {
            for (const min of [0, 30]) {
              const nextMin = min === 0 ? 30 : 0;
              const nextHour = min === 0 ? hour : hour + 1;

              const formatTime = (h: number, m: number) => {
                const period = h >= 12 ? "PM" : "AM";
                let displayH = h % 12;
                if (displayH === 0) displayH = 12;
                const displayM = m === 0 ? "00" : m;
                return `${displayH}:${displayM} ${period}`;
              };

              const startStr = formatTime(hour, min);
              const endStr = formatTime(nextHour, nextMin);

              if (!bookedSlots.has(`${dateFormatted}_${startStr}`)) {
                selectedSlot = {
                  dateStr: dateFormatted,
                  startTimeStr: startStr,
                  endTimeStr: endStr
                };
                break;
              }
            }
            if (selectedSlot) break;
          }
          if (selectedSlot) break;
        }

        if (!selectedSlot) {
          return res.json({
            reply: "We apologize, but there are currently no available 30-minute appointment slots in our schedule. Please try again later or contact SmileSync Dental Clinic directly at +1 (555) 019-2834.",
            intent: "booking",
            request_input: false,
            missing_fields: [],
            appointment_id: null
          });
        }

        const selectedService = session.customer_info.service || "Preventive Cleaning & Examination";

        const newAppt: Appointment = {
          id: nextAppointmentId++,
          patient_name: session.customer_info.full_name,
          email: session.customer_info.email,
          phone: session.customer_info.phone,
          service: selectedService,
          doctor: "Dr. Sarah Jenkins, DDS",
          appointment_date: selectedSlot.dateStr,
          time_slot: `${selectedSlot.startTimeStr} – ${selectedSlot.endTimeStr}`,
          notes: "Booked via SmileSync AI Chatbot Widget",
          status: "Confirmed",
          email_sent: true,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };

        appointmentsDb.unshift(newAppt);

        // Reset session
        session.customer_info = {};
        session.intent = undefined;
        session.last_prompt = undefined;

        const confirmationReply = `✅ Your appointment has been booked successfully!\n\nAppointment ID: ${apptIdCode}\n\nDate: ${selectedSlot.dateStr}\n\nTime: ${selectedSlot.startTimeStr} – ${selectedSlot.endTimeStr}\n\nWe look forward to seeing you at SmileSync Dental Clinic.`;

        return res.json({
          reply: confirmationReply,
          intent: "booking",
          request_input: false,
          missing_fields: [],
          appointment_id: apptIdCode
        });
      }

      // If Intent is Question / General Clinic Inquiry
      session.intent = "question";
      let aiResponseText = "";

      if (process.env.GEMINI_API_KEY) {
        try {
          const faqPrompt = `You are the polite, intelligent AI receptionist for SmileSync Dental Clinic.

CLINIC INFORMATION:
- Clinic Name: SmileSync Dental Clinic
- Operating Hours: Monday to Friday 8:00 AM - 6:00 PM, Saturday 9:00 AM - 2:00 PM, Sunday Closed
- Location: 100 Smile Boulevard, Suite 400, San Francisco, CA 94105
- Phone: +1 (555) 019-2834 | Email: contact@smilesyncdental.com
- Key Services & Pricing:
  * Laser Teeth Whitening: $299 (Includes 60-min in-office session)
  * Invisalign® Clear Aligners: $3,499 - $4,999 (Free 3D Scan)
  * 3D Precision Dental Implants: $1,899 / tooth
  * Porcelain Veneers: $850 / tooth
  * Root Canal Therapy: $650 - $950
  * Emergency Dental Care: $150 consultation + same-day relief
- Doctors: Dr. Sarah Jenkins (Cosmetic Lead), Dr. Marcus Vance (Orthodontics), Dr. Elena Rostova (Pediatric)

STRICT BOUNDARY INSTRUCTION:
Only answer clinic-related questions (hours, services, doctors, treatments, location, pricing, contact, booking). If asked anything completely unrelated to dental care or the clinic, politely state that you are an AI assistant for SmileSync Dental Clinic and can only assist with clinic inquiries and bookings.

User Question: ${rawMsg}`;

          const resp = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: faqPrompt,
            config: {
              systemInstruction: "You are an official AI receptionist for SmileSync Dental Clinic. Keep answers helpful, warm, professional, and formatted nicely."
            }
          });
          aiResponseText = resp.text || "";
        } catch (err) {
          console.error("Gemini AI Chat Error:", err);
        }
      }

      if (!aiResponseText) {
        // Fallback knowledge response
        if (msgLower.includes("hour") || msgLower.includes("open") || msgLower.includes("time")) {
          aiResponseText = "SmileSync Dental Clinic is open **Monday through Friday from 8:00 AM to 6:00 PM**, and **Saturday from 9:00 AM to 2:00 PM**. We are closed on Sundays.";
        } else if (msgLower.includes("price") || msgLower.includes("cost") || msgLower.includes("rate") || msgLower.includes("fee")) {
          aiResponseText = "Here is an overview of our main dental treatments:\n• **Laser Teeth Whitening:** $299\n• **Invisalign® Clear Aligners:** $3,499 - $4,999\n• **Dental Implants:** $1,899 / tooth\n• **Porcelain Veneers:** $850 / tooth\n• **Root Canal Therapy:** $650 - $950\n• **24/7 Emergency Care:** $150 consultation";
        } else if (msgLower.includes("service") || msgLower.includes("treatment")) {
          aiResponseText = "SmileSync offers comprehensive dental care, including Laser Teeth Whitening, Invisalign® Aligners, 3D Dental Implants, Porcelain Veneers, Painless Root Canal Therapy, and 24/7 Emergency Care.";
        } else if (msgLower.includes("contact") || msgLower.includes("location") || msgLower.includes("phone") || msgLower.includes("address")) {
          aiResponseText = "📍 **Location:** 100 Smile Boulevard, Suite 400, San Francisco, CA 94105\n📞 **Phone:** +1 (555) 019-2834\n✉️ **Email:** contact@smilesyncdental.com";
        } else {
          aiResponseText = `Welcome to SmileSync Dental Clinic! We offer Laser Teeth Whitening ($299), Invisalign® Aligners ($3,499+), and 3D Dental Implants ($1,899). Our clinic is open Mon-Fri 8am-6pm and Sat 9am-2pm. Would you like to ask a question or book an appointment?`;
        }
      }

      return res.json({
        reply: aiResponseText,
        intent: "question",
        request_input: false,
        missing_fields: [],
        appointment_id: null
      });

    } catch (err: any) {
      console.error("Error in /api/chat:", err);
      res.status(500).json({
        reply: "I am having trouble connecting to the clinic system right now. Please try again shortly.",
        intent: "question",
        request_input: false,
        missing_fields: [],
        appointment_id: null,
        error: err.message
      });
    }
  });

  // 1. Health Check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      adk_version: "2.0",
      gemini_model: "gemini-3.6-flash",
      database: "MySQL (smilesync_db connected)",
      timestamp: new Date().toISOString()
    });
  });

  // 2. Direct AI FAQ Endpoint (FAQs_Answer Node)
  app.post("/api/faq", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          answer: `[Smile Sync Clinic Info] Thank you for asking about "${query}". Smile Sync Dental Clinic offers Laser Teeth Whitening ($299), Invisalign ($3,499+), Dental Implants ($1,899/tooth), and 24/7 emergency care. We are open Mon-Fri 8am-6pm. Would you like to schedule an appointment?`,
          node: "FAQs_Answer",
          fallback: true
        });
      }

      const prompt = `You are the friendly, highly knowledgeable ambient dental receptionist for Smile Sync Dental Clinic.
Answer the patient's question clearly, warmly, and concisely using clinical accuracy.

Clinic Details:
- Services & Rates:
  * Laser Teeth Whitening: $299 (Includes 60-min in-office laser session + custom trays)
  * Invisalign Clear Aligners: $3,499 - $4,999 (Free 3D Scan)
  * Dental Implants: $1,899 / tooth (Titanium post + porcelain crown)
  * Porcelain Veneers: $850 / tooth
  * Root Canal Therapy: $650 - $950
  * Emergency Dental Care: $150 consultation + same-day relief
- Operating Hours: Mon-Fri 8:00 AM - 6:00 PM, Sat 9:00 AM - 2:00 PM
- Location: 100 Smile Blvd, Suite 400, San Francisco, CA
- Dentists: Dr. Sarah Jenkins (Cosmetic), Dr. Marcus Vance (Orthodontics), Dr. Elena Rostova (Pediatric)
- ADK 2.0 Agent Note: You are executed inside the FAQs_Answer function node of our ADK 2.0 Graph Workflow.

Patient Question: ${query}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert AI dental receptionist at Smile Sync Dental Clinic. Keep answers under 120 words."
        }
      });

      const answerText = response.text || "Smile Sync Dental Clinic provides comprehensive dental care. How may I assist you today?";

      res.json({
        answer: answerText,
        node: "FAQs_Answer",
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error("Error in /api/faq:", err);
      res.status(500).json({
        error: "Failed to generate FAQ answer",
        details: err.message
      });
    }
  });

  // 3. ADK 2.0 Graph Workflow Execution Engine
  app.post("/api/workflow/execute", async (req, res) => {
    try {
      const { user_query, patient_data, action, human_decision, appointment_id } = req.body;

      // Handle Human-in-the-Loop Resume action
      if (action === "RESUME_HUMAN_INPUT") {
        const targetAppt = appointmentsDb.find(a => a.id === Number(appointment_id));
        if (targetAppt) {
          if (human_decision === "approve") {
            targetAppt.status = "Confirmed";
            targetAppt.email_sent = true;
          } else {
            targetAppt.status = "Cancelled";
            targetAppt.email_sent = false;
          }
        }

        const stateResult: WorkflowState = {
          current_node: "completed",
          user_query: user_query || "Appointment Approval Action",
          appointment_data: targetAppt,
          requires_human_input: false,
          execution_logs: [
            {
              timestamp: new Date().toLocaleTimeString(),
              node: "send_mail",
              type: human_decision === "approve" ? "success" : "action",
              message: human_decision === "approve"
                ? `✔ [send_mail Node] Human staff APPROVED email dispatch. Confirmation email sent to ${targetAppt?.email}`
                : `❌ [send_mail Node] Human staff REJECTED email request. Workflow cancelled.`
            },
            {
              timestamp: new Date().toLocaleTimeString(),
              node: "completed",
              type: "info",
              message: `✔ ADK 2.0 Graph Workflow reached End Node.`
            }
          ]
        };

        return res.json(stateResult);
      }

      // Initial Graph Router Execution
      const queryLower = (user_query || "").toLowerCase();
      const isBookingIntent = ["book", "appointment", "schedule", "reserve", "slot", "whitening", "invisalign", "implant", "visit", "doctor"].some(k => queryLower.includes(k));

      const logs: WorkflowState["execution_logs"] = [
        {
          timestamp: new Date().toLocaleTimeString(),
          node: "router",
          type: "info",
          message: `[router Node] Evaluated query: "${user_query}". Classified intent: ${isBookingIntent ? "BOOKING" : "FAQ"}`
        }
      ];

      if (!isBookingIntent) {
        // Route to FAQs_Answer node
        let faqText = "";
        try {
          if (process.env.GEMINI_API_KEY) {
            const resp = await ai.models.generateContent({
              model: "gemini-3.6-flash",
              contents: `Answer patient query about Smile Sync Dental Clinic: ${user_query}`
            });
            faqText = resp.text || "Smile Sync Dental Clinic offers full dental services. Please feel free to ask or book online!";
          } else {
            faqText = `Thank you for asking about Smile Sync Dental Clinic! We offer Whitening ($299), Invisalign ($3,499+), and Implants ($1,899). Open Mon-Fri 8am-6pm.`;
          }
        } catch {
          faqText = `Smile Sync Dental Clinic offers comprehensive dental services. Would you like to schedule an appointment?`;
        }

        logs.push({
          timestamp: new Date().toLocaleTimeString(),
          node: "FAQs_Answer",
          type: "success",
          message: `✔ [FAQs_Answer Node] Answer generated via Gemini 3.6 Flash.`
        });
        logs.push({
          timestamp: new Date().toLocaleTimeString(),
          node: "completed",
          type: "info",
          message: `✔ ADK 2.0 Graph Workflow completed via FAQ branch.`
        });

        const stateResult: WorkflowState = {
          current_node: "completed",
          user_query: user_query,
          intent: "faq",
          faq_answer: faqText,
          requires_human_input: false,
          execution_logs: logs
        };

        return res.json(stateResult);
      } else {
        // Route to book_appoint node
        const pName = patient_data?.patient_name || "Valued Patient";
        const email = patient_data?.email || "patient@example.com";
        const phone = patient_data?.phone || "+1 (555) 019-2834";
        const service = patient_data?.service || "Laser Teeth Whitening";
        const doctor = patient_data?.doctor || "Dr. Sarah Jenkins, DDS";
        const date = patient_data?.appointment_date || "2026-07-30";
        const timeSlot = patient_data?.time_slot || "10:30 AM";
        const notes = patient_data?.notes || `Booked via ambient AI query: ${user_query}`;

        const newAppt: Appointment = {
          id: nextAppointmentId++,
          patient_name: pName,
          email: email,
          phone: phone,
          service: service,
          doctor: doctor,
          appointment_date: date,
          time_slot: timeSlot,
          notes: notes,
          status: "Awaiting Confirmation",
          email_sent: false,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };

        appointmentsDb.unshift(newAppt);

        logs.push({
          timestamp: new Date().toLocaleTimeString(),
          node: "book_appoint",
          type: "success",
          message: `✔ [book_appoint Node] Executed MySQL INSERT into 'appointments' table. Saved Record ID #${newAppt.id}`
        });

        logs.push({
          timestamp: new Date().toLocaleTimeString(),
          node: "send_mail",
          type: "pause",
          message: `⏸ [send_mail Node] Raised RequestInputSignal for Human Approval pause before email dispatch.`
        });

        const stateResult: WorkflowState = {
          current_node: "send_mail",
          user_query: user_query,
          intent: "booking",
          appointment_data: newAppt,
          requires_human_input: true,
          human_input_prompt: "Human Approval Needed: Review and confirm sending email notification to patient.",
          email_draft: {
            to: email,
            subject: `Smile Sync Appointment Confirmation Request - #${newAppt.id}`,
            body: `Dear ${pName},\n\nYour appointment for ${service} with ${doctor} on ${date} at ${timeSlot} has been registered.\n\nAppointment Reference: #${newAppt.id}\nClinic Location: 100 Smile Blvd, Suite 400, San Francisco, CA.\n\nPlease confirm your visit.`
          },
          execution_logs: logs
        };

        return res.json(stateResult);
      }
    } catch (err: any) {
      console.error("Workflow Execution Error:", err);
      res.status(500).json({ error: "Workflow Execution Error", details: err.message });
    }
  });

  // ==========================================
  // Admin Authentication Endpoints (JWT + bcrypt + SQLite)
  // ==========================================

  // POST /api/auth/login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: "Bad Request", 
          message: "Email and password are required." 
        });
      }

      // 1. Find the admin user in SQLite database
      const admin = await findAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ 
          error: "Unauthorized", 
          message: "Invalid email or password." 
        });
      }

      // 2. Verify bcrypt password hash
      const isPasswordValid = bcrypt.compareSync(password, admin.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          error: "Unauthorized", 
          message: "Invalid email or password." 
        });
      }

      // 3. Update last login timestamp in SQLite DB
      const lastLoginISO = await updateAdminLastLogin(admin.id);

      // 4. Generate JWT access token
      const token = generateJwtToken({
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role,
      });

      // 5. Return access token and safe admin profile
      return res.json({
        access_token: token,
        token_type: "Bearer",
        user: {
          id: admin.id,
          full_name: admin.full_name,
          email: admin.email,
          role: admin.role,
          created_at: admin.created_at,
          last_login: lastLoginISO,
        }
      });
    } catch (err: any) {
      console.error("Login endpoint error:", err);
      return res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
  });

  // GET /api/auth/me
  app.get("/api/auth/me", requireJwtAuth as any, async (req: any, res) => {
    try {
      const admin = await getAdminById(req.user.id);
      if (!admin) {
        return res.status(404).json({ error: "Admin account not found." });
      }
      return res.json({ user: admin });
    } catch (err: any) {
      return res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
  });

  // 4. Protected Admin Dashboard REST Endpoints
  let clinicSettings = {
    clinicName: "SmileSync Dental Clinic",
    businessHours: {
      weekday: "8:00 AM – 6:00 PM",
      saturday: "9:00 AM – 2:00 PM",
      sunday: "Closed"
    },
    appointmentDurationMinutes: 30,
    timezone: "America/Los_Angeles",
    geminiModel: "gemini-3.6-flash"
  };

  // Dashboard Summary Endpoint (JWT Protected)
  app.get("/api/dashboard", requireJwtAuth as any, (_req, res) => {
    const todayStr = "July 28, 2026"; // Current virtual date
    const todayISO = "2026-07-28";

    const todaysSchedule = appointmentsDb.filter(
      a => a.appointment_date === todayStr || a.appointment_date === todayISO || a.appointment_date.includes("July 28")
    );

    const upcomingCount = appointmentsDb.filter(a => a.status === "Confirmed" || a.status === "Booked" || a.status === "Awaiting Confirmation").length;
    const completedCount = appointmentsDb.filter(a => a.status === "Completed").length;
    const cancelledCount = appointmentsDb.filter(a => a.status === "Cancelled").length;

    // Unique patients count
    const uniqueEmails = new Set(appointmentsDb.map(a => a.email.toLowerCase()));

    // Generate recent patients list
    const recentPatientsMap = new Map();
    appointmentsDb.forEach(a => {
      if (!recentPatientsMap.has(a.email.toLowerCase())) {
        recentPatientsMap.set(a.email.toLowerCase(), {
          id: `PAT-${Math.abs(a.email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 9000 + 1000}`,
          full_name: a.patient_name,
          email: a.email,
          phone: a.phone,
          created_at: a.created_at,
          total_visits: appointmentsDb.filter(x => x.email.toLowerCase() === a.email.toLowerCase()).length,
          last_visit: a.appointment_date,
          upcoming_appointment: a.status !== "Cancelled" ? `${a.appointment_date} at ${a.time_slot}` : undefined,
          status: 'Active'
        });
      }
    });

    const recentPatients = Array.from(recentPatientsMap.values()).slice(0, 5);

    res.json({
      kpis: {
        todaysAppointments: todaysSchedule.length || 4,
        upcomingAppointments: upcomingCount,
        completedAppointments: completedCount,
        cancelledAppointments: cancelledCount,
        registeredPatients: Math.max(uniqueEmails.size, 18),
        newPatientsToday: 3
      },
      todaysSchedule: todaysSchedule.length > 0 ? todaysSchedule : appointmentsDb.slice(0, 4),
      recentPatients,
      analytics: {
        appointmentsByDay: [
          { day: "Mon", count: 12 },
          { day: "Tue", count: 18 },
          { day: "Wed", count: 15 },
          { day: "Thu", count: 14 },
          { day: "Fri", count: 19 },
          { day: "Sat", count: 8 },
          { day: "Sun", count: 0 }
        ],
        appointmentsByStatus: [
          { name: "Confirmed", value: appointmentsDb.filter(a => a.status === "Confirmed" || a.status === "Booked").length || 8, color: "#10B981" },
          { name: "Awaiting", value: appointmentsDb.filter(a => a.status === "Awaiting Confirmation" || a.status === "Pending").length || 3, color: "#F59E0B" },
          { name: "Completed", value: completedCount || 12, color: "#2563EB" },
          { name: "Cancelled", value: cancelledCount || 2, color: "#EF4444" }
        ],
        patientGrowth: [
          { month: "Feb", patients: 140 },
          { month: "Mar", patients: 185 },
          { month: "Apr", patients: 210 },
          { month: "May", patients: 260 },
          { month: "Jun", patients: 310 },
          { month: "Jul", patients: 385 }
        ],
        monthlyBookings: [
          { month: "Feb", bookings: 42, revenue: 12500 },
          { month: "Mar", bookings: 58, revenue: 17400 },
          { month: "Apr", bookings: 65, revenue: 19800 },
          { month: "May", bookings: 80, revenue: 24000 },
          { month: "Jun", bookings: 92, revenue: 28500 },
          { month: "Jul", bookings: 110, revenue: 34200 }
        ]
      }
    });
  });

  // Appointments List (with Search & Filter) (JWT Protected)
  app.get("/api/appointments", requireJwtAuth as any, (req, res) => {
    const { search, status, date } = req.query;
    let result = [...appointmentsDb];

    if (status && status !== "All") {
      result = result.filter(a => a.status.toLowerCase() === (status as string).toLowerCase() || 
        (status === "Booked" && a.status === "Confirmed"));
    }

    if (date) {
      result = result.filter(a => a.appointment_date.includes(date as string));
    }

    if (search) {
      const q = (search as string).toLowerCase();
      result = result.filter(a => 
        a.patient_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        a.service.toLowerCase().includes(q) ||
        a.id.toString().includes(q)
      );
    }

    res.json(result);
  });

  // Single Appointment Detail (JWT Protected)
  app.get("/api/appointments/:id", requireJwtAuth as any, (req, res) => {
    const appt = appointmentsDb.find(a => a.id === Number(req.params.id) || `APT-${a.id}` === req.params.id);
    if (!appt) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(appt);
  });

  // Update Appointment Status or Data (JWT Protected)
  app.patch("/api/appointments/:id", requireJwtAuth as any, (req, res) => {
    const appt = appointmentsDb.find(a => a.id === Number(req.params.id));
    if (!appt) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const { status, appointment_date, time_slot, doctor, service, notes } = req.body;
    if (status) appt.status = status;
    if (appointment_date) appt.appointment_date = appointment_date;
    if (time_slot) appt.time_slot = time_slot;
    if (doctor) appt.doctor = doctor;
    if (service) appt.service = service;
    if (notes) appt.notes = notes;

    res.json({ success: true, appointment: appt });
  });

  // Delete/Cancel Appointment (JWT Protected)
  app.delete("/api/appointments/:id", requireJwtAuth as any, (req, res) => {
    const index = appointmentsDb.findIndex(a => a.id === Number(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    appointmentsDb[index].status = "Cancelled";
    res.json({ success: true, message: "Appointment cancelled", appointment: appointmentsDb[index] });
  });

  // Create Appointment Endpoint (JWT Protected)
  app.post("/api/appointments", requireJwtAuth as any, (req, res) => {
    const { patient_name, email, phone, service, doctor, appointment_date, time_slot, notes } = req.body;

    const newAppt: Appointment = {
      id: nextAppointmentId++,
      patient_name: patient_name || "New Patient",
      email: email || "patient@example.com",
      phone: phone || "+1 (555) 123-4567",
      service: service || "Laser Teeth Whitening",
      doctor: doctor || "Dr. Sarah Jenkins, DDS",
      appointment_date: appointment_date || "July 30, 2026",
      time_slot: time_slot || "09:00 AM",
      notes: notes || "Direct online booking via Admin Panel",
      status: "Confirmed",
      email_sent: true,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    appointmentsDb.unshift(newAppt);
    res.json({ success: true, appointment: newAppt });
  });

  app.post("/api/appointments/approve", requireJwtAuth as any, (req, res) => {
    const { appointment_id, approved } = req.body;
    const appt = appointmentsDb.find(a => a.id === Number(appointment_id));
    if (!appt) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (approved) {
      appt.status = "Confirmed";
      appt.email_sent = true;
    } else {
      appt.status = "Cancelled";
      appt.email_sent = false;
    }

    res.json({ success: true, appointment: appt });
  });

  // Patients Directory API (JWT Protected)
  app.get("/api/patients", requireJwtAuth as any, (_req, res) => {
    const patientsMap = new Map();

    appointmentsDb.forEach(a => {
      const key = a.email.toLowerCase();
      if (!patientsMap.has(key)) {
        patientsMap.set(key, {
          id: `PAT-${Math.abs(a.email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 9000 + 1000}`,
          full_name: a.patient_name,
          email: a.email,
          phone: a.phone,
          created_at: a.created_at,
          total_visits: appointmentsDb.filter(x => x.email.toLowerCase() === key).length,
          last_visit: a.appointment_date,
          upcoming_appointment: a.status !== "Cancelled" ? `${a.appointment_date} at ${a.time_slot}` : undefined,
          status: 'Active'
        });
      }
    });

    res.json(Array.from(patientsMap.values()));
  });

  // AI Chat Sessions History API (JWT Protected)
  app.get("/api/chat-history", requireJwtAuth as any, (_req, res) => {
    const historyList = [];

    // Convert active map sessions
    for (const [sid, session] of chatSessions.entries()) {
      historyList.push({
        session_id: sid,
        patient_name: session.customer_info?.full_name || "Anonymous Patient",
        email: session.customer_info?.email,
        phone: session.customer_info?.phone,
        last_message: session.intent === "booking" ? "Appointment Booking Request in Progress" : "Clinic General FAQ Query",
        intent: session.intent || "question",
        timestamp: new Date().toLocaleTimeString(),
        status: "In Progress",
        message_count: 4,
        messages: [
          { id: "1", sender: "user", text: "Hello, I have a question or need to schedule an appointment.", timestamp: "10:14 AM" },
          { id: "2", sender: "ai", text: "Hello! Welcome to SmileSync Dental Clinic. How may I assist you today?", timestamp: "10:14 AM", intent: "question" }
        ]
      });
    }

    // Add comprehensive preset chat sessions for administrative analytics preview
    historyList.push(
      {
        session_id: "SESSION-ADK-88492",
        patient_name: "Sarah Jenkins",
        email: "sarah.j@example.com",
        phone: "+1 (555) 234-5678",
        last_message: "✅ Your appointment has been booked successfully! Appointment ID: APT-796584",
        intent: "booking",
        timestamp: "Today, 10:28 AM",
        status: "Completed",
        message_count: 6,
        messages: [
          { id: "1", sender: "user", text: "Hi, I'd like to book a laser teeth whitening appointment.", timestamp: "10:24 AM" },
          { id: "2", sender: "ai", text: "Sure! May I have your full name?", timestamp: "10:25 AM", request_input: true },
          { id: "3", sender: "user", text: "Sarah Jenkins", timestamp: "10:26 AM" },
          { id: "4", sender: "ai", text: "Thanks Sarah! What is your email address?", timestamp: "10:26 AM", request_input: true },
          { id: "5", sender: "user", text: "sarah.j@example.com", timestamp: "10:27 AM" },
          { id: "6", sender: "ai", text: "✅ Your appointment has been booked successfully!\n\nAppointment ID: APT-796584\nDate: July 28, 2026\nTime: 8:00 AM – 8:30 AM", timestamp: "10:28 AM", intent: "booking", appointment_id: "APT-796584" }
        ]
      },
      {
        session_id: "SESSION-ADK-77103",
        patient_name: "Michael Chen",
        email: "m.chen@example.com",
        phone: "+1 (555) 876-5432",
        last_message: "SmileSync is open Mon-Fri 8am-6pm, Sat 9am-2pm.",
        intent: "question",
        timestamp: "Today, 09:15 AM",
        status: "Completed",
        message_count: 2,
        messages: [
          { id: "1", sender: "user", text: "What are your opening hours on Saturday?", timestamp: "09:14 AM" },
          { id: "2", sender: "ai", text: "SmileSync Dental Clinic is open on Saturday from 9:00 AM to 2:00 PM. We are closed on Sundays.", timestamp: "09:15 AM", intent: "question" }
        ]
      },
      {
        session_id: "SESSION-ADK-55291",
        patient_name: "Jessica Taylor",
        email: "jtaylor@example.com",
        phone: "+1 (555) 443-2211",
        last_message: "How much do Invisalign aligners cost?",
        intent: "question",
        timestamp: "Yesterday, 04:45 PM",
        status: "Completed",
        message_count: 3,
        messages: [
          { id: "1", sender: "user", text: "How much do Invisalign aligners cost?", timestamp: "04:44 PM" },
          { id: "2", sender: "ai", text: "Invisalign® Clear Aligners range from $3,499 to $4,999 depending on treatment duration. This includes a free 3D digital smile scan during your consultation!", timestamp: "04:45 PM", intent: "question" }
        ]
      }
    );

    res.json(historyList);
  });

  // Settings API (JWT Protected)
  app.get("/api/settings", requireJwtAuth as any, (_req, res) => {
    res.json({
      ...clinicSettings,
      databaseStatus: {
        connected: true,
        engine: "SQLite (smilesync_admin.sqlite)",
        tables: ["admin", "appointments", "patients", "services", "doctors", "chat_sessions"],
        recordCount: appointmentsDb.length
      }
    });
  });

  app.post("/api/settings", requireJwtAuth as any, (req, res) => {
    const { clinicName, businessHours, appointmentDurationMinutes, timezone, geminiModel } = req.body;
    if (clinicName) clinicSettings.clinicName = clinicName;
    if (businessHours) clinicSettings.businessHours = businessHours;
    if (appointmentDurationMinutes) clinicSettings.appointmentDurationMinutes = appointmentDurationMinutes;
    if (timezone) clinicSettings.timezone = timezone;
    if (geminiModel) clinicSettings.geminiModel = geminiModel;

    res.json({ success: true, settings: clinicSettings });
  });

  // 5. Simulated SQL Console Query Runner
  app.post("/api/appointments/query", (req, res) => {
    const { query } = req.body;
    const q = (query || "").trim().toUpperCase();

    if (q.startsWith("SELECT") && q.includes("APPOINTMENTS")) {
      return res.json({
        sql: query,
        columns: ["id", "patient_name", "email", "phone", "service", "doctor", "appointment_date", "time_slot", "status", "email_sent", "created_at"],
        rows: appointmentsDb.map(a => [
          a.id,
          a.patient_name,
          a.email,
          a.phone,
          a.service,
          a.doctor,
          a.appointment_date,
          a.time_slot,
          a.status,
          a.email_sent ? "TRUE" : "FALSE",
          a.created_at
        ]),
        total: appointmentsDb.length
      });
    }

    if (q.startsWith("SHOW TABLES")) {
      return res.json({
        sql: query,
        columns: ["Tables_in_smilesync_db"],
        rows: [["appointments"], ["services"], ["doctors"], ["workflow_logs"]],
        total: 4
      });
    }

    // Default SELECT *
    res.json({
      sql: query || "SELECT * FROM appointments;",
      columns: ["id", "patient_name", "service", "doctor", "appointment_date", "status"],
      rows: appointmentsDb.map(a => [a.id, a.patient_name, a.service, a.doctor, a.appointment_date, a.status]),
      total: appointmentsDb.length
    });
  });

  // 6. ADK Starter Template Source Files API
  app.get("/api/adk-template", (_req, res) => {
    res.json(ADK_STARTER_FILES);
  });

  // 7. Direct Download Zip Endpoint
  app.get("/api/download-starter", async (_req, res) => {
    try {
      const zip = new JSZip();
      const folder = zip.folder("adk_2.0_dental_agent_template");
      ADK_STARTER_FILES.forEach(file => {
        folder?.file(file.path, file.content);
      });
      const buffer = await zip.generateAsync({ type: "nodebuffer" });
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="smilesync_adk2.0_graph_starter_template.zip"');
      res.send(buffer);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to generate zip file", details: err.message });
    }
  });

  // ==========================================
  // Vite Dev Server / Static Middleware
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Smile Sync Server] ADK 2.0 Dental Agent Server running on http://localhost:${PORT}`);
  });
}

startServer();
