import React from 'react'
import { useLocation } from 'react-router-dom'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Stepper from '@/features/stepper/components/Stepper'

const StepperPage = () => {
  const location = useLocation();
  const isRenewal = location.state?.isRenewal || false;
  const renewalData = location.state?.renewalData || null;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <Stepper isRenewal={isRenewal} renewalData={renewalData} />
        </div>
      </SidebarInset>
    </SidebarProvider> 
  )
}

export default StepperPage