import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Power } from "lucide-react"
import { useContext } from "react"
import { UserAuthContext } from "@/features/auth/context/AuthContext"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export function SiteHeader() {
  const { logout } = useContext(UserAuthContext);
  const navigate = useNavigate();

  const handleQuickLogout = async () => {
    try {
      toast.loading("Signing out...", {
        id: "quick-logout",
        description: "Finalizing your session securely"
      });
      
      // Ejecutar logout y esperar 2 segundos completos
      const logoutPromise = logout();
      const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));
      
      // Esperar a que ambos se completen (logout + 2 segundos)
      await Promise.all([logoutPromise, delayPromise]);
      
      toast.success("Signed out successfully", {
        id: "quick-logout",
        description: "You have been signed out successfully",
        duration: 3000
      });
      
      navigate('/login');
    } catch (error) {
      toast.error("Error signing out", {
        id: "quick-logout",
        description: "Unable to sign out. Please try again.",
        duration: 5000
      });
    }
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">SMGYM Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleQuickLogout}
            className="hidden sm:flex text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/20 transition-colors"
            title="Cerrar sesión rápidamente"
          >
            <Power className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
