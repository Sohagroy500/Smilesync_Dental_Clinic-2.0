export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  icon: string;
  popular?: boolean;
  beforeAfterImage?: {
    before: string;
    after: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experience: string;
  education: string;
  image: string;
  availableDays: string[];
  rating: number;
  languages?: string[];
  socials?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface Appointment {
  id: number;
  patient_name: string;
  email: string;
  phone: string;
  service: string;
  doctor: string;
  appointment_date: string;
  time_slot: string;
  notes?: string;
  status: 'Pending' | 'Awaiting Confirmation' | 'Confirmed' | 'Booked' | 'Completed' | 'Cancelled';
  email_sent: boolean;
  created_at: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface WhyChooseUsFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  photo: string;
  rating: number;
  review: string;
  serviceReceived: string;
  date: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  icon: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
}

export interface AdkFile {
  path: string;
  name: string;
  language: string;
  content: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  intent?: 'question' | 'booking';
  appointment_id?: string | null;
  request_input?: boolean;
}

export interface ChatResponse {
  reply: string;
  intent: 'question' | 'booking';
  request_input: boolean;
  missing_fields?: string[];
  appointment_id?: string | null;
  error?: string;
}

export interface GraphNodeState {
  id: 'router' | 'FAQs_Answer' | 'book_appoint' | 'send_mail';
  name: string;
  description: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
}

export interface WorkflowState {
  current_node: 'router' | 'FAQs_Answer' | 'book_appoint' | 'send_mail' | 'completed' | 'idle';
  user_query: string;
  intent?: 'faq' | 'booking' | 'general';
  faq_answer?: string;
  appointment_data?: Partial<Appointment>;
  email_draft?: {
    to: string;
    subject: string;
    body: string;
  };
  requires_human_input: boolean;
  human_input_prompt?: string;
  execution_logs: Array<{
    timestamp: string;
    node: string;
    type: 'info' | 'success' | 'pause' | 'action';
    message: string;
  }>;
}

export interface Patient {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  total_visits: number;
  last_visit?: string;
  upcoming_appointment?: string;
  status: 'Active' | 'Inactive';
}

export interface ChatSessionAdmin {
  session_id: string;
  patient_name: string;
  email?: string;
  phone?: string;
  last_message: string;
  intent: 'question' | 'booking';
  timestamp: string;
  status: 'Completed' | 'In Progress' | 'Escalated';
  message_count: number;
  messages: ChatMessage[];
}

export interface DashboardSummary {
  kpis: {
    todaysAppointments: number;
    upcomingAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    registeredPatients: number;
    newPatientsToday: number;
  };
  todaysSchedule: Appointment[];
  recentPatients: Patient[];
  analytics: {
    appointmentsByDay: Array<{ day: string; count: number }>;
    appointmentsByStatus: Array<{ name: string; value: number; color: string }>;
    patientGrowth: Array<{ month: string; patients: number }>;
    monthlyBookings: Array<{ month: string; bookings: number; revenue: number }>;
  };
}

export interface ClinicSettings {
  clinicName: string;
  businessHours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  appointmentDurationMinutes: number;
  timezone: string;
  geminiModel: string;
  databaseStatus: {
    connected: boolean;
    engine: string;
    tables: string[];
    recordCount: number;
  };
}
