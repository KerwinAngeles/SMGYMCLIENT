import { DataTable } from "@/components/shadcn/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { columns } from "@/features/attendance/datatable/columns"
import { type AttendanceRecord } from '@/features/attendance/types'
import {User, Calendar, Loader2} from 'lucide-react'

interface AttendanceListProps {
    records: AttendanceRecord[]
    isLoading?: boolean
    className?: string
}

export function AttendanceList({ records, isLoading, className }: AttendanceListProps) {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        })
    }

    if (isLoading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading Attendance Records
                    </CardTitle>
                    <CardDescription>
                        Please wait while we fetch the latest attendance data
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (records.length === 0) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Today's Attendance
                    </CardTitle>
                    <CardDescription>
                        No attendance records found for today
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            No clients have checked in today yet.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Use the "Check In Client" button to register the first arrival.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Attendance
                </CardTitle>
                <CardDescription>
                    {records.length} attendance record{records.length !== 1 ? 's' : ''} for {formatDate(new Date())}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <DataTable
                        columns={columns}
                        data={records}
                        value="accessCode"
                    />
                </div>
            </CardContent>
        </Card>
    )
}
