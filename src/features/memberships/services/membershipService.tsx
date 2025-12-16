import api from "@/services/api";
import { config } from "@/config/environment";
import { type RenewalData } from "../types";

const API = config.apiUrl;

export async function getAllMemberships() {
    const response = await api.get(`${API}/Membership/GetAllMembership`);
    return response.data;
}


export async function renewMembership(renewalData: RenewalData) {
    const response = await api.post(`${API}/Membership/RenewMembership`, renewalData);
    return response.data;
}

