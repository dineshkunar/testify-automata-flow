
interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Since we're removing auth, always allow access
  return <>{children}</>;
};
