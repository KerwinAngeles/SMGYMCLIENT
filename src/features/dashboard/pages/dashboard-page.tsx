import { ChartAreaInteractive } from "@/components/shadcn/chart-area-interactive"
import { SectionCards } from "@/components/shadcn/section-cards"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AnimatePresence, motion } from "framer-motion";


export default function DashboardPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="space-y-5"
                >
                  <SectionCards />
                  <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
