import api from "@/services/api";
import { config } from "@/config/environment";
import { type AttendanceRequest } from "@/features/attendance/types";

const API = config.apiUrl;
async function getAllAttendance() {
    const response = await api.get(`${API}/Attendace/GetAllAttendance`);
    return response.data;
}

async function getAttendanceSummary() {
    const response = await api.get(`${API}/ReportPanel/GetSummaryAttendace`);
    return response.data;
}

async function checkInClient(attendanceRequest: AttendanceRequest) {
    const response = await api.post(`${API}/Attendace/RegisterAttendace`, attendanceRequest);
    return response.data;
}

export const attendanceService = {
    getAllAttendance,
    getAttendanceSummary,
    checkInClient,
};
