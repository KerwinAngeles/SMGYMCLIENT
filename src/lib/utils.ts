import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {type Step } from "@/features/stepper/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};


export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES');
};

export const getStepNumber = (step: Step, isRenewal: boolean): number => {
  if (isRenewal) {
    switch (step) {
      case 'plan': return 1;
      case 'payment': return 2;
      default: return 1;
    }
  } else {
    switch (step) {
      case 'client': return 1;
      case 'plan': return 2;
      case 'payment': return 3;
      default: return 1;
    }
  }
};