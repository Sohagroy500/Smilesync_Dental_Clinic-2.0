import React, { useState, useEffect } from 'react';
import { Sidebar, AdminTab } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { DashboardOverview } from './DashboardOverview';
import { AppointmentTable } from './AppointmentTable';
import { PatientList } from './PatientList';
import { ChatHistoryView } from './ChatHistoryView';
import { DoctorsList } from './DoctorsList';
import { ServicesCatalog } from './ServicesCatalog';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { SettingsView } from './SettingsView';
import { AppointmentModal } from './AppointmentModal';
import { AdminLogin } from './AdminLogin';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { adminApiService } from '../../services/adminApiService';
import { Appointment, Patient, ChatSessionAdmin, DashboardSummary, ClinicSettings } from '../../types';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  onSwitchToPatientSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onSwitchToPatientSite }) => {
  const { isAuthenticated, user, loading: authLoading, error: authError, login, logout } = useAdminAuth();

  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Data states
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSessionAdmin[]>([]);
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create' | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Fetch data from REST APIs
  const loadData = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const [sumRes, apptsRes, patRes, chatRes, setRes] = await Promise.all([
        adminApiService.getDashboardSummary(),
        adminApiService.getAppointments(),
        adminApiService.getPatients(),
        adminApiService.getChatHistory(),
        adminApiService.getSettings(),
      ]);

      setSummary(sumRes);
      setAppointments(apptsRes);
      setPatients(patRes);
      setChatSessions(chatRes);
      setSettings(setRes);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handlers
  const handleUpdateStatus = async (id: number, status: 'Confirmed' | 'Completed' | 'Cancelled') => {
    try {
      await adminApiService.updateAppointment(id, { status });
      await loadData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleSaveAppointment = async (data: Partial<Appointment>) => {
    try {
      if (modalMode === 'create') {
        await adminApiService.createAppointment(data);
      } else if (modalMode === 'edit' && selectedAppointment) {
        await adminApiService.updateAppointment(selectedAppointment.id, data);
      }
      await loadData();
    } catch (err) {
      alert('Failed to save appointment');
    }
  };

  const handleSaveSettings = async (newSettings: Partial<ClinicSettings>) => {
    try {
      await adminApiService.updateSettings(newSettings);
      await loadData();
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  // 1. Initial Authentication Check Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-400">Verifying Admin Session...</p>
      </div>
    );
  }

  // 2. Unauthenticated State -> Render Modern Login Screen
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={loadData}
        onReturnToPatientSite={onSwitchToPatientSite}
        loginFn={login}
        initialError={authError}
      />
    );
  }

  // 3. Authenticated State -> Render Full Admin Dashboard
  return (
    <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans ${darkMode ? 'dark text-slate-100' : 'text-slate-800'}`}>
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onSwitchToPatientSite={onSwitchToPatientSite}
        todayCount={summary?.kpis?.todaysAppointments}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar
          onOpenNewAppointmentModal={() => {
            setSelectedAppointment(null);
            setModalMode('create');
          }}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          user={user}
          onLogout={logout}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {currentTab === 'dashboard' && (
            <DashboardOverview
              summary={summary}
              loading={loading}
              onNavigateToTab={(tab) => setCurrentTab(tab as AdminTab)}
              onViewAppointmentDetails={(appt) => {
                setSelectedAppointment(appt);
                setModalMode('view');
              }}
            />
          )}

          {currentTab === 'appointments' && (
            <AppointmentTable
              appointments={appointments}
              loading={loading}
              onRefresh={loadData}
              onOpenNewModal={() => {
                setSelectedAppointment(null);
                setModalMode('create');
              }}
              onUpdateStatus={handleUpdateStatus}
              onViewDetails={(appt) => {
                setSelectedAppointment(appt);
                setModalMode('view');
              }}
              onEditDetails={(appt) => {
                setSelectedAppointment(appt);
                setModalMode('edit');
              }}
            />
          )}

          {currentTab === 'patients' && (
            <PatientList
              patients={patients}
              appointments={appointments}
              loading={loading}
            />
          )}

          {currentTab === 'chat-history' && (
            <ChatHistoryView
              chatSessions={chatSessions}
              loading={loading}
            />
          )}

          {currentTab === 'doctors' && <DoctorsList />}

          {currentTab === 'services' && <ServicesCatalog />}

          {currentTab === 'analytics' && (
            <AnalyticsDashboard analytics={summary?.analytics} />
          )}

          {currentTab === 'settings' && (
            <SettingsView settings={settings} onSaveSettings={handleSaveSettings} />
          )}
        </main>
      </div>

      {/* Appointment Modal */}
      {modalMode && (
        <AppointmentModal
          mode={modalMode}
          appointment={selectedAppointment}
          onClose={() => setModalMode(null)}
          onSubmit={handleSaveAppointment}
        />
      )}
    </div>
  );
};
