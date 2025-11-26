import React  from "react";
import type { ReactNode } from "react";
import { UserAuthContext } from "@/features/auth/context/AuthContext";
import { useContext } from "react";

interface RoleGuardProps {
    children: ReactNode;
    requiredRoles: string[];
    requireAllRoles?: boolean;
    fallback?: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles,
  requireAllRoles = false,
  fallback = null,
}) => {
  const { hasRole, hasAnyRole } = useContext(UserAuthContext); ;

  const hasAccess = requireAllRoles
    ? requiredRoles.every(role => hasRole(role))
    : hasAnyRole(requiredRoles);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};