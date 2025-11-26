import api from "@/services/api";
import { config } from "@/config/environment";
import { type EditPlanRequest, type CreatePlanRequest } from "@/features/plans/types";

const API = config.apiUrl;
async function getAllPlans(){
    const response = await api.get(`${API}/Plan/GetAllPlansWithInclude`);
    return response.data;
}

async function EditPlan(id: number, credentials: EditPlanRequest){
  const response = await api.put(`${API}/Plan/UpdatePlan/${id}`, credentials);
  return response.data;
}

async function CreatePlan(credentials: CreatePlanRequest){
  const response = await api.post(`${API}/Plan/CreatePlan`, credentials);
  return response.data;
}

async function DeletePlan(planId: number){
  const response = await api.delete(`${API}/Plan/DeletePlan/${planId}`);
  return response.data;
}

export const planService = {
    EditPlan, getAllPlans, CreatePlan, DeletePlan
};