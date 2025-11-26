import { CheckCircle2 } from 'lucide-react';
import { type Step } from '../types';
import { STEPS } from '../constants';

interface StepIndicatorProps {
  currentStep: Step;
  isRenewal?: boolean;
}

export const StepIndicator = ({ currentStep, isRenewal = false }: StepIndicatorProps) => {
  const getStepIndex = (stepId: Step): number => {
    const filteredSteps = isRenewal ? STEPS.filter(s => s.id !== 'client') : STEPS;
    return filteredSteps.findIndex(s => s.id === stepId);
  };

  const currentStepIndex = getStepIndex(currentStep);
  const filteredSteps = isRenewal ? STEPS.filter(s => s.id !== 'client') : STEPS;

  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-12 relative">
      {filteredSteps.map((step) => {
        const stepIndex = getStepIndex(step.id);
        const isCompleted = stepIndex < currentStepIndex;
        const isCurrent = stepIndex === currentStepIndex;

        return (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                isCompleted
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                  : isCurrent
                  ? 'bg-primary text-primary-foreground border-primary shadow-xl scale-110'
                  : 'bg-background text-muted-foreground border-muted'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <step.icon className='w-6 h-6'/>
              )}
            </div>
            <div className="text-center mt-3">
              <div className={`font-semibold text-sm ${
                isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.label}
              </div>
              <div className={`text-xs mt-1 ${
                isCurrent ? 'text-primary/70' : 'text-muted-foreground'
              }`}>
                {step.description}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Progress line */}
      <div className="absolute top-8 left-8 right-8 h-0.5 bg-muted -z-10">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ 
            width: `${(currentStepIndex / (filteredSteps.length - 1)) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};
