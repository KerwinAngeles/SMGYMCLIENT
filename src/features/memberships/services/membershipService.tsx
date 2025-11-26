import api from "@/services/api";
import { config } from "@/config/environment";

const API = config.apiUrl;

export async function getAllMemberships(){
    const response = await api.get(`${API}/Membership/GetAllMembership`);
    console.log('Memberships API response:', response.data);
    return response.data;
}

export async function getClientByName(clientName: string) {
    try {
        const response = await api.get(`${API}/Client/GetClientByName/${encodeURIComponent(clientName)}`);
        console.log('Client by name response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting client by name:', error);
        throw error;
    }
}

// Alternative: Get all clients and find by name
export async function getAllClients() {
    try {
        const response = await api.get(`${API}/Client/GetAllClients`);
        console.log('All clients response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting all clients:', error);
        throw error;
    }
}

export interface RenewalData {
    membershipId: string;
    clientId: number;
    planId: number;
    planName: string;
    planPrice: number;
    startDate: string;
    endDate: string;
    duration: number;
    features: string[];
}

export async function renewMembership(renewalData: RenewalData) {
    console.log('Sending renewal data to API:', renewalData);
    const response = await api.post(`${API}/Membership/RenewMembership`, renewalData);
    console.log('API response:', response.data);
    return response.data;
}