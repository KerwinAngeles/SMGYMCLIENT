import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { Step, FormData } from '../types';
import { stepperService } from "@/features/stepper/services/stepperService";
import { validateClientStep } from '../utils/validation';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { type CreatePayment, type ConfirmPayment } from '@/features/stepper/types';
import { type PaymentMethod } from '@/features/stepper/types';

export const useStepper = (isRenewal: boolean = false, renewalData: any = null) => {
  const [step, setStep] = useState<Step>(isRenewal ? 'plan' : 'client');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    client: isRenewal && renewalData ? { 
      id: renewalData.clientId, 
      fullName: '', 
      email: '', 
      phoneNumber: '', 
      nationalId: '', 
      birthDay: '' 
    } : { id: 0, fullName: '', email: '', phoneNumber: '', nationalId: '', birthDay: '' },
    plan: isRenewal && renewalData ? { id: renewalData.planId } : { id: 0 },
    paymentMethod: { id: 0, name: '', description: '' }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        [name]: value,
      }
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePlanChange = (planId: number) => {
    setFormData((prev) => ({
      ...prev,
      plan: { id: planId },
    }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const handleNext = async () => {
    if (step === 'client' && !isRenewal) {
      const newErrors = validateClientStep(formData);
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error('Please fix the errors before continuing');
        return;
      }
      try {
        const clientResponse = await stepperService.createClient(formData.client);
        console.log("Client created:", clientResponse);
        setFormData(prev => ({
          ...prev,
          client: {
            ...prev.client,
            ...clientResponse.data,
          }
        }));
        // Slow motion effect: delay el cambio de paso
        setIsLoading(true);
        setTimeout(() => {
          setStep('plan');
          setIsLoading(false);
        }, 600); // 600ms de transición
      } catch (error) {
        toast.error('Error creating client');
        console.error(error);
      }
    } else if (step === 'plan') {
      if (!formData.plan) {
        toast.error('Please select a membership plan');
        return;
      }
      // Slow motion effect: delay el cambio de paso
      setIsLoading(true);
      setTimeout(() => {
        setStep('payment');
        setIsLoading(false);
      }, 600); // 600ms de transición
    }
  };

  const handleBack = () => {
    if (step === 'plan' && !isRenewal) {
      setStep('client');
    } else if (step === 'payment') {
      setStep('plan');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paymentMethod || !formData.paymentMethod.id) {
      toast.error('Please select a payment method');
      return;
    }
    if ((formData.paymentMethod.name === 'credit' || formData.paymentMethod.name === 'debit') && !elements) {
      toast.error('Stripe elements not loaded');
      return;
    }

    setIsLoading(true);

    try {
      const { clientSecret, paymentIntentId } = await stepperService.createPaymentIntent({
        planId: formData.plan?.id,
        clientId: isRenewal && renewalData ? renewalData.clientId : formData.client.id,
        paymentMethodId: formData.paymentMethod.id,
      } as CreatePayment);

      let confirmPaymentId = paymentIntentId;
      if (formData.paymentMethod.name == "Credit Card" || formData.paymentMethod.name == "Debit Card") {
        const cardElement = elements!.getElement(CardElement) || null;
        console.log("Card Element:", cardElement);
        const result = await stripe!.confirmCardPayment(clientSecret!, {
          payment_method: {
            card: cardElement!,
            billing_details: {
              name: formData.client.fullName,
              email: formData.client.email,
            },
          },
        });

        if (result.error) {
          toast.error(result.error.message || 'Payment failed');
          setIsLoading(false);
          return;
        }

        confirmPaymentId = result.paymentIntent.id || null;
      }

      const responseConfirmPayment = await stepperService.confirmPayment({
        clientId: isRenewal && renewalData ? renewalData.clientId : formData.client.id,
        planId: formData.plan?.id,
        paymentIntentId: confirmPaymentId,
      } as ConfirmPayment);
      if (responseConfirmPayment.data.pdfUrl) {
        window.open(responseConfirmPayment.data.pdfUrl, '_blank');
      }

      if (isRenewal) {
        toast.success('🎉 Membership successfully renewed! Welcome back to SMGYM!');
      } else {
        toast.success('🎉 Membership successfully created! Welcome to SMGYM!');
      }
      navigate('/membership');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while processing the membership. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    formData,
    errors,
    isLoading,
    handleInputChange,
    handlePlanChange,
    handlePaymentMethodChange,
    handleNext,
    handleBack,
    handleSubmit,
  };
};
