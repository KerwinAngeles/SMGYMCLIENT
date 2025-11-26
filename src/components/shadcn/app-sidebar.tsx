import * as React from "react"

import {
  IconCheck,
  IconDashboard,
  IconInnerShadowTop,
  IconUser,
  IconUsersGroup,
  IconMoneybag,
  IconCreditCardPay,
  IconRepeat
} from "@tabler/icons-react"

import { NavMain } from "@/components/shadcn/nav-main"
import { NavUser } from "@/components/shadcn/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserAuthContext } from "@/features/auth/context/AuthContext"
import { useContext } from "react"
import { Link } from "react-router-dom"

const data = {
  user: {
    name: "",
    email: "",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    
    {
      title: "Join Process",
      url: "/stepper",
      icon: IconRepeat,
      roles: ["Administrator"],
    },

    {
      title: "Staff",
      url: "/staff",
      icon: IconUsersGroup,
      roles: ["Administrator"],
    },
    {
      title: "Clients",
      url: "/client",
      icon: IconUser,
    },
    {
      title: "Attendance",
      url: "/attendance",
      icon: IconCheck,
    },
    {
      title: "Memberships",
      url: "/membership",
      icon: IconCreditCardPay,
    },
    {
      title: "Plans",
      url: "/plan",
      icon: IconMoneybag,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, hasRole } = useContext(UserAuthContext);
  const filteredNav = data.navMain.filter(
    (item) => !item.roles || item.roles.some((role) => hasRole(role))
  );
  if (!user) return null;
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SMGM Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
