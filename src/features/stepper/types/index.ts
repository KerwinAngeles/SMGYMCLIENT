import type { LucideIcon } from "lucide-react";
export type Step = 'client' | 'plan' | 'payment';

export interface FormData {
  client: Client;
  paymentMethod: PaymentMethod;
  plan: Plan;
}

export interface Client {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  birthDay: string;
}

export interface Plan {
  id: number;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
}

export interface StepInfo {
  id: Step;
  label: string;
  description: string;
  icon: LucideIcon;
}


export interface CreatePayment {
  planId: number;
  clientId: number;
  paymentMethodId: number;

}

export interface ConfirmPayment {
  clientId: number;
  planId: number;
  paymentIntentId: string;
}
