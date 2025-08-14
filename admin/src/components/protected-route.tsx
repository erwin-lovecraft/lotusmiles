import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  // roles?: string[];
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading…</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Optional: check role form ID token custom claim
  // const roles = (user as any)?.["https://yourdomain/roles"] || [];
  // if (!roles.includes("admin")) return <Navigate to="/auth-error?code=access_denied&message=Admin+only" replace />;

  return <>{props.children}</>;
}
