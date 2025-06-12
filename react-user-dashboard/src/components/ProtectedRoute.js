import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ component: Component }) => {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace state={{ authError: true, from: location.pathname }} />;
  }

  return <Component />;
};

export default ProtectedRoute;

