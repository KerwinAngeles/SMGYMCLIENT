import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"
import type { User as AuthUser } from "@/features/auth/types"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserAuthContext } from "@/features/auth/context/AuthContext";
import { useContext, useState, useEffect, useCallback } from "react"
import { LogoutConfirmationModal } from "../custom/LogoutConfirmationModal"
import { LoadingOverlay } from "../custom/LoadingOverlay"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { motion } from "framer-motion"
interface NavUserProps {
  user: AuthUser;
}

export function NavUser({ user }: NavUserProps) {
  const { isLoading, logout } = useContext(UserAuthContext);
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = useCallback(() => {
    if (!isLoggingOut) {
      setShowLogoutModal(true);
      setError(null);
    }
  }, [isLoggingOut]);

  const handleConfirmLogout = useCallback(async () => {
    if (isLoggingOut) return; // Prevenir múltiples llamadas
    
    setIsLoggingOut(true);
    
    // Mostrar toast de inicio de logout
    toast.loading("Signing out...", {
      id: "logout",
      description: "Finalizing your session securely"
    });
    
    try {
      const logoutPromise = logout();
      const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));
      await Promise.all([logoutPromise, delayPromise]);
        toast.success("Signed out successfully", {
        id: "logout",
        description: "You have been signed out successfully",
        duration: 3000
      });
      
      setShowLogoutModal(false);
      setIsLoggingOut(false);
      setError(null);
      
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || 'Unable to sign out. Please try again.';
      setError(errorMessage);
      
      toast.error("Error signing out", {
        id: "logout",
        description: errorMessage,
        duration: 5000
      });
      
      setShowLogoutModal(false);
      setIsLoggingOut(false);
    }
  }, [logout, isLoggingOut]);

  const handleCancelLogout = useCallback(() => {
    if (!isLoggingOut) {
      setShowLogoutModal(false);
      setError(null);
    }
  }, [isLoggingOut]);

  const handleAccountClick = () => {
    navigate('/account');
  };

  useEffect(() => {
    if (!user && isLoggingOut) {
      setIsLoggingOut(false);
    }
  }, [user, isLoggingOut]);

  if (isLoading) {
    return <div>Loading user...</div>;
  }

  if (!user) {
    return <div>No authenticated user</div>;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
              >
                <motion.div
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <Avatar className="h-8 w-8 rounded-lg grayscale">
                    <AvatarImage src={''} alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {user.name ? user.name[0] : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium"> {user.name} {user.roles.join(', ')}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: 0 }}
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <IconDotsVertical className="ml-auto size-4" />
                </motion.div>
              </SidebarMenuButton>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={''} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name ? user.name[0] : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate font-medium">{user.roles.join(', ')}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleAccountClick}>
                <IconUserCircle />
                My Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogoutClick}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 transition-colors"
            >
              <IconLogout />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
      
      <LogoutConfirmationModal
        open={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />
      
      <LoadingOverlay 
        isVisible={isLoggingOut} 
        message="Signing you out..." 
      />
    </SidebarMenu>
  );
}