
import { Navigate } from 'react-router-dom';

const Auth = () => {
  // Since we're removing auth, redirect directly to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Auth;
