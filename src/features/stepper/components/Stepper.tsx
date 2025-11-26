import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StepIndicator } from './StepIndicator';
import { ClientForm } from './ClientForm';
import { PlanSelection } from './PlanSelection';
import { PaymentForm } from './PaymentForm';
import { NavigationButtons } from './NavigationButtons';
import { useStepper } from '../hooks/useStepper';
import { AnimatePresence, motion } from "framer-motion";

interface StepperProps {
  isRenewal?: boolean;
  renewalData?: any;
}

const Stepper = ({ isRenewal = false, renewalData = null }: StepperProps) => {
  const {
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
  } = useStepper(isRenewal, renewalData);

  // Animación de transición para los pasos
  const renderStepContent = () => {
    let content = null;
    switch (step) {
      case 'client':
        if (!isRenewal) {
          content = (
            <ClientForm
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />
          );
        }
        break;
      case 'plan':
        content = (
          <PlanSelection
            formData={formData}
            onPlanChange={(planId: number) => {
              handlePlanChange(planId); 
            }}
          />
        );
        break;
      case 'payment':
        content = (
          <PaymentForm
            formData={formData}
            errors={errors}
            onPaymentMethodChange={handlePaymentMethodChange}
          />
        );
        break;
      default:
        content = null;
    }
   
    return (
     <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 1.2, ease: "easeInOut" }} // slow motion
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-lg">
            <Users className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-black text-foreground mb-4">
            Join Today
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start your fitness journey with us. Complete your membership registration in just a few simple steps.
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <StepIndicator currentStep={step} isRenewal={isRenewal} />

            <form onSubmit={handleSubmit} className="space-y-8">
              {renderStepContent()}

              <NavigationButtons
                currentStep={step}
                isLoading={isLoading}
                onBack={handleBack}
                onNext={handleNext}
                onSubmit={handleSubmit}
                isRenewal={isRenewal}
              />
            </form>
          </CardContent>
        </Card>

        {/* Footer Information */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@smgym.com" className="text-primary hover:underline">
              support@smgym.com
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            By completing this registration, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
