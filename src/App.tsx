import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { DoctorsSection } from './components/DoctorsSection';
import { AppointmentSection } from './components/AppointmentSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/chat/ChatWidget';
import { AdminLayout } from './components/admin/AdminLayout';

export default function App() {
  const [viewMode, setViewMode] = useState<'patient' | 'admin'>('patient');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string>('');
  const [preselectedDoctorName, setPreselectedDoctorName] = useState<string>('');

  // Synchronize dark class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Track scroll position to update active nav link
  useEffect(() => {
    if (viewMode !== 'patient') return;

    const handleScroll = () => {
      const sections = ['home', 'services', 'why-us', 'doctors', 'appointment', 'testimonials', 'faq', 'blog', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  const scrollToAppointment = (serviceId?: string, doctorName?: string) => {
    if (serviceId) setPreselectedServiceId(serviceId);
    if (doctorName) setPreselectedDoctorName(doctorName);

    const apptElement = document.getElementById('appointment');
    if (apptElement) {
      apptElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (viewMode === 'admin') {
    return (
      <AdminLayout
        onSwitchToPatientSite={() => setViewMode('patient')}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300`}>
      
      {/* Sticky Top Header */}
      <Header
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenBooking={() => scrollToAppointment()}
        onOpenAdmin={() => setViewMode('admin')}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero */}
        <HeroSection
          onOpenBooking={() => scrollToAppointment()}
          onExploreServices={() => scrollToSection('services')}
        />

        {/* Animated Statistics Banner */}
        <StatsSection />

        {/* Dental Services Catalog */}
        <ServicesSection
          onSelectServiceToBook={(sId) => scrollToAppointment(sId)}
        />

        {/* Why Choose Us */}
        <WhyChooseUsSection />

        {/* Specialist Doctors */}
        <DoctorsSection
          onSelectDoctorToBook={(dName) => scrollToAppointment(undefined, dName)}
        />

        {/* Appointment CTA & Form */}
        <AppointmentSection
          initialServiceId={preselectedServiceId}
          initialDoctorName={preselectedDoctorName}
        />

        {/* Patient Testimonials */}
        <TestimonialsSection />

        {/* FAQ Accordion */}
        <FaqSection />

        {/* Dental Care Articles */}
        <BlogSection />

        {/* Contact & Map Location */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenBooking={() => scrollToAppointment()}
      />

      {/* Floating AI Chatbot Widget connected to Google ADK 2.0 Backend */}
      <ChatWidget />

    </div>
  );
}
