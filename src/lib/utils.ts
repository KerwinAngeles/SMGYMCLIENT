import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Step } from "@/features/stepper/types";

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

export const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

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

export const getAge = (birthDay: string) => {
  try {
    const birthDate = new Date(birthDay)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  } catch {
    return 'Unknown'
  }
}


export const getRoleBadgeVariant = (role: string) => {
  switch (role.toLowerCase()) {
    case 'administrator':
    case 'admin':
      return 'destructive';
    case 'manager':
      return 'default';
    case 'staff':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
