import api from "@/services/api";
import { config } from "@/config/environment";
import { type FormData } from "../types";
import { type CreatePayment, type ConfirmPayment } from "@/features/stepper/types";

const API = config.apiUrl;

async function createClient(formData: FormData['client']) {
  const response = await api.post(`${API}/Client/CreateClient`, formData);
  return response.data;
}

export async function getAllPaymentMethods(){
  const response = await api.get(`${API}/PaymentMethod/GetAllPaymentMethod`);
  return response.data;
}
  
export async function createPaymentIntent(data: CreatePayment){
  const response = await api.post(`${API}/Payment/CreatePayment`, data);
  return response.data;
}

export async function confirmPayment(data: ConfirmPayment) {
  const response = await api.post(`${API}/Payment/ConfirmPayment`, data);
  return response.data;
}

export const stepperService = {
  createClient,
  createPaymentIntent,
  confirmPayment
}

