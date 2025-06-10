
import { Navigate } from "react-router-dom";

const Login = () => {
  // Redirect to dashboard since we removed auth
  return <Navigate to="/dashboard" replace />;
};

export default Login;
