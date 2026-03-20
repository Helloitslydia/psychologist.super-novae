import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import { AuthForm } from './components/AuthForm.tsx';
import { ToastProvider } from './components/ToastProvider.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { AdminAuth } from './components/AdminAuth.tsx';
import { PsychologistDashboard } from './components/PsychologistDashboard.tsx';
import { MentalHealthResources } from './components/MentalHealthResources.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { DashboardLanguageProvider } from './context/DashboardLanguageContext.tsx';
import { DatabaseSeeder } from './components/DatabaseSeeder.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <LanguageProvider>
        <DashboardLanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<AdminAuth />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/dashboard" element={<PsychologistDashboard />} />
          <Route path="/resources" element={<MentalHealthResources />} />
          <Route path="/seed" element={<DatabaseSeeder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
        </DashboardLanguageProvider>
      </LanguageProvider>
    </ToastProvider>
  </StrictMode>
);
