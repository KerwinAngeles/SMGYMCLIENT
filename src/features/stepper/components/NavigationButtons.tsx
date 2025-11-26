import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {type Step } from '../types';

interface NavigationButtonsProps {
  currentStep: Step;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isRenewal?: boolean;
}

export const NavigationButtons = ({ 
  currentStep, 
  isLoading, 
  onBack, 
  onNext, 
  onSubmit,
  isRenewal = false
}: NavigationButtonsProps) => {
  const getStepNumber = (step: Step): number => {
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

  const totalSteps = isRenewal ? 2 : 3;

  return (
    <div className="flex justify-between items-center pt-8 border-t">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onBack} 
        disabled={(isRenewal ? currentStep === 'plan' : currentStep === 'client') || isLoading}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Step {getStepNumber(currentStep)} of {totalSteps}</span>
      </div>

      {currentStep !== 'payment' ? (
        <Button 
          type="button" 
          onClick={onNext} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button 
          type="submit" 
          disabled={isLoading}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          onClick={onSubmit}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isRenewal ? 'Renewing Membership...' : 'Creating Membership...'}
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              {isRenewal ? 'Complete Renewal' : 'Complete Registration'}
            </>
          )}
        </Button>
      )}
    </div>
  );
};
