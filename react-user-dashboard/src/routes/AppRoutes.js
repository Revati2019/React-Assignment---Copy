import { Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import UserProfile from '../pages/UserProfile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
      <Route path="/user/:id" element={<ProtectedRoute component={UserProfile} />} />

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
