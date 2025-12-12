import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Step } from '../types';
import { getStepNumber } from '@/lib/utils';

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
        <span>Step {getStepNumber(currentStep, isRenewal)} of {totalSteps}</span>
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
