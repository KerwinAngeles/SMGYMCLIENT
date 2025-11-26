export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const cardRegex = /^[0-9]{13,19}$/;
  return cardRegex.test(cardNumber.replace(/\s/g, ''));
};

export const validateExpiryDate = (expiryDate: string): boolean => {
  const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!expiryRegex.test(expiryDate)) return false;
  
  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  const expYear = parseInt(year);
  const expMonth = parseInt(month);
  
  return expYear > currentYear || (expYear === currentYear && expMonth >= currentMonth);
};

export const validateCVV = (cvv: string): boolean => {
  return /^[0-9]{3,4}$/.test(cvv);
};

export interface ValidationErrors {
  [key: string]: string;
}

export const validateClientStep = (formData: any): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData?.client?.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  }
  if (!formData?.client?.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.client.email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (formData?.client?.phoneNumber && !validatePhone(formData.client.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number';
  }
  if (formData?.client?.nationalId && formData.client.nationalId.length < 8) {
    errors.nationalId = 'National ID must be at least 8 characters';
  }

  return errors;
};
