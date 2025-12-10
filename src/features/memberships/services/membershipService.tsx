import api from "@/services/api";
import { config } from "@/config/environment";
import {type RenewalData } from "../types";

const API = config.apiUrl;

export async function getAllMemberships(){
    const response = await api.get(`${API}/Membership/GetAllMembership`);
    console.log('Memberships API response:', response.data);
    return response.data;
}


export async function renewMembership(renewalData: RenewalData) {
    console.log('Sending renewal data to API:', renewalData);
    const response = await api.post(`${API}/Membership/RenewMembership`, renewalData);
    console.log('API response:', response.data);
    return response.data;
}

