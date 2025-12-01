import api from "@/services/api";
import { config } from "@/config/environment";
import { type Client, type ClientEdit } from "@/features/clients/types";

const API = config.apiUrl;
async function getAllClients(){
    const response = await api.get(`${API}/Client/GetAllClients`);
    console.log(response);
    return response.data.data;
}

async function updateClient(clientEdit: ClientEdit, id: number){
    const response = await api.put(`${API}/Client/UpdateClient/${id}`, clientEdit);
    console.log(response);
    return response.data;
}

async function createClient(client: Client){
    const response = await api.post(`${API}/Client/CreateClient`, client);
    console.log(response);
    return response.data;
}

async function getClientByName(clientName: string) {
    try {
        const response = await api.get(`${API}/Client/GetClientByName/${encodeURIComponent(clientName)}`);
        console.log('Client by name response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting client by name:', error);
        throw error;
    }
}


export const clientService = {
    getAllClients, updateClient, createClient, getClientByName
}

