import type { ReactNode } from "react";
import { Navigate, useLocation } from 'react-router-dom'
import { UserAuthContext } from "@/features/auth/context/AuthContext";
import { useContext } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  requireAllRoles?: boolean;
}

export const ProtectedRoute = ({
  children,
  requiredRoles = [],
  requireAllRoles = false,

}: ProtectedRouteProps) => {
  const { user, isLoading } = useContext(UserAuthContext);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0) {
    const hasRequiredRoles = requireAllRoles
      ? requiredRoles.every(role => user.roles.includes(role))
      : requiredRoles.some(role => user.roles.includes(role));

    if (!hasRequiredRoles) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};


