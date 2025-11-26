import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type AttendanceSummary } from '@/features/attendance/types'
import { Activity } from 'lucide-react'

interface AttendanceStatsProps {
    todayRecords: AttendanceSummary | null
    className?: string
}

export function AttendanceStats({ todayRecords, className }: AttendanceStatsProps) {
    const stats = [
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

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={index} className="relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
