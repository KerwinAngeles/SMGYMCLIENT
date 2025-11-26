import api from "@/services/api";
import { config } from "@/config/environment";
const API = config.apiUrl;


export async function getClientsStatistics(){
    const response = await api.get(`${API}/ReportPanel/GetClientsStatistics`);
    console.log(response);
    return response.data;
}

export async function getChartAttendance(days: number){
    const response = await api.get(`${API}/ReportPanel/GetChartAttendance`, { params: { days } });
    console.log(response);
    return response.data;
}

