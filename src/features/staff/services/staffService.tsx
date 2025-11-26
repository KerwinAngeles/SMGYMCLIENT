import api from "@/services/api";
import { config } from "@/config/environment";
import {type StatusStaff, type Staff} from "@/features/staff/types";
const API = config.apiUrl;
 
async function getAllStaff(){
    const response = await api.get(`${API}/Account/GetAllStaff`);
    return response.data;
}

async function changeStatusStaff(credentials: StatusStaff) {
    const response = await api.put(`${API}/Account/ChangeStatusStaff`, credentials);
    return response.data;
}

async function EditStaff(credentials: Staff){
  const response = await api.put(`${API}/Account/EditStaff`, credentials);
  return response.data;
}

export const staffService = {
  getAllStaff,
  changeStatusStaff,
  EditStaff
};