
import { Navigate } from "react-router-dom";

const Index = () => {
  // Since we're removing auth, redirect directly to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
