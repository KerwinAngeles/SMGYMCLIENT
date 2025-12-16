import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StastAttendance } from "@/lib/consts"
import { type AttendanceStatsProps } from "@/features/attendance/types"

export function AttendanceStats({ todayRecords, className }: AttendanceStatsProps) {
    const stats = StastAttendance({
        todayRecords,
    })
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
