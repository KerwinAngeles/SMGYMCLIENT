import { useEffect, useState } from "react";
import { getChartAttendance } from "@/features/dashboard/services/dashboardService";

export function useAttendanceChart(days: number) {
    const [data, setData] = useState<Array<{ date: string; attendanceCount: number }>>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getChartAttendance(days);
                setData(response);
                console.log(response);
            } catch (error) {
                console.error("Error fetching attendance chart data:", error);
            }
        }
        fetchData();
    }, [days]);

    return data;
}
