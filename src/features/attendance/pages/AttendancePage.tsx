import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { type AttendanceRecord, type AttendanceSummary } from '@/features/attendance/types'
import { attendanceService } from '../services/attendanceService'
import { AttendanceCheckIn } from '../components/AttendanceCheckIn'
import { AttendanceStats } from '../components/AttendanceStats'
import { AttendanceList } from '../components/AttendanceList'
import { AnimatePresence, motion } from "framer-motion";
import { toast } from 'sonner'
import { Calendar, Users, RefreshCw } from 'lucide-react'
import { today } from "@/lib/utils"

async function getAttendanceData(): Promise<AttendanceRecord[]> {
    const response = await attendanceService.getAllAttendance();
    return response;
}

async function getAttendanceSummary(): Promise<AttendanceSummary | null> {
    const response = await attendanceService.getAttendanceSummary();
    return response;
}

const AttendancePage = () => {
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
    const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        loadAttendanceData()
    }, [])

    const loadAttendanceData = async () => {
        setLoading(true)
        try {
            const records = await getAttendanceData()
            const summary = await getAttendanceSummary()
            setAttendanceSummary(summary)
            setAttendanceRecords(records)
        } catch (error) {
            toast.error('Failed to load attendance data')
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        try {
            const records = await getAttendanceData()
            const summary = await getAttendanceSummary()
            setAttendanceSummary(summary)
            setAttendanceRecords(records)
            toast.success('Attendance data refreshed')
        } catch (error) {
            toast.error('Failed to refresh attendance data')
        } finally {
            setRefreshing(false)
        }
    }

    const handleAttendanceRecorded = () => {
        loadAttendanceData()
    }

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
        >
            <SidebarInset>
                <div className="flex justify-center">
                    <div className="flex flex-col flex-1 px-4 py-8 gap-8 max-w-[1200px] mx-auto">
                        {/* Header Section */}
                        <div className="text-center space-y-6 relative">
                            {/* Background Elements */}
                            <div className="absolute inset-0 -z-10">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-lg">
                                    <Users className="h-10 w-10 text-primary-foreground" />
                                </div>
                                <h1 className="text-5xl font-black text-foreground mb-4">
                                    Attendance Management
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                    Track client arrivals and departures. Monitor gym activity and session durations in real-time.
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{today}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 justify-center">
                            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg shadow-md border border-border">
                                <span className="text-sm font-medium text-muted-foreground">Quick Actions:</span>
                                <AttendanceCheckIn
                                    onAttendanceRecorded={handleAttendanceRecorded}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="gap-2"
                                >
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }} // slow motion
                            >
                                {/* Statistics */}
                                <AttendanceStats
                                    todayRecords={attendanceSummary}
                                    className="mb-6"

                                />

                                {/* Attendance List */}
                                <AttendanceList
                                    records={attendanceRecords}
                                    isLoading={loading}
                                    className="mb-6"
                                />
                            </motion.div>
                        </AnimatePresence>


                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AttendancePage