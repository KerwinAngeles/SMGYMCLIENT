import { type AttendanceStatsProps, type StatAttendanceItem } from "@/features/attendance/types";
import { Activity } from 'lucide-react'

export const StastAttendance = (
    {
        todayRecords,
    }: AttendanceStatsProps): StatAttendanceItem[] => [
        {
            title: "Total Visits Today",
            value: todayRecords ? todayRecords.totalDays.toString() : '0',
            description: ` unique clients`,
            icon: Activity,
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        },
        {
            title: "Total Visits Week",
            value: todayRecords ? todayRecords.totalThisWeek.toString() : '0',
            description: "Finished workouts",
            icon: Activity,
            color: "text-purple-600",
            bgColor: "bg-purple-100"
        },
        {
            title: "Total Visits Month",
            value: todayRecords ? todayRecords.totalThisMonth.toString() : '0',
            description: "Finished workouts",
            icon: Activity,
            color: "text-purple-600",
            bgColor: "bg-purple-100"
        },
    ]