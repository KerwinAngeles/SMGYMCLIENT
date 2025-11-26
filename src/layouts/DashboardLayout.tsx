import React, { useContext } from "react"
import { AppSidebar } from "@/components/shadcn/app-sidebar"
import { SiteHeader } from "@/components/shadcn/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { UserAuthContext } from "@/features/auth/context/AuthContext"
import { useSessionTimeout } from "@/hooks/useSessionTimeout"
import { SessionTimeoutModal } from "@/components/custom/SessionTimeoutModal"

type DashboardLayoutProps = {
    children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { logout } = useContext(UserAuthContext);
    const { showWarning, timeRemaining, extendSession, handleLogout } = useSessionTimeout(logout);

    return (
        <SidebarProvider>
            <div className="flex h-screen w-screen">
                <AppSidebar className="w-64 border-r" />
                <div className="flex flex-1 flex-col">
                    <SiteHeader />
                    <main className="flex-1 bg-muted overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
            
            <SessionTimeoutModal
                open={showWarning}
                onExtend={extendSession}
                onLogout={handleLogout}
                timeRemaining={timeRemaining}
            />
        </SidebarProvider>
    )
}
