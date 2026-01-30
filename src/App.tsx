
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import GlobalLoader from './components/GlobalLoader';

// Lazy load pages for "real" loading effect
const LandingPage = lazy(() => import('./pages/LandingPage'));
const JoinPage = lazy(() => import('./pages/JoinPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SurveyPage = lazy(() => import('./pages/SurveyPage'));
const LabsPage = lazy(() => import('./pages/LabsPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const WaitlistPage = lazy(() => import('./pages/WaitlistPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));

function App() {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/labs" element={<LabsPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
