import { Dumbbell, CheckCircle2, Star } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { type FormData } from '../types';
import { planService } from '@/features/plans/services/planService';
import { useEffect, useState } from 'react';

interface PlanSelectionProps {
  formData: FormData;
  onPlanChange: (planId: number) => void;
}

export const PlanSelection = ({formData, onPlanChange }: PlanSelectionProps) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState(formData.plan?.id || 0);

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await planService.getAllPlans();
      setPlans(response);
    };
    fetchPlans();
  }, []);

  const handlePlanChange = (planId: number) => {
    setSelectedPlan(planId);
    onPlanChange(planId);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Dumbbell className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Choose Your Perfect Plan</h3>
        <p className="text-muted-foreground">
          Select the membership that best fits your fitness goals
        </p>
      </div>

      <RadioGroup
        value={ selectedPlan.toString() }
        onValueChange={(value) => handlePlanChange(Number(value))}
        className="grid gap-6 md:grid-cols-3"
      >
        {plans?.map((plan) => (
          <div key={plan.id} className="relative">
            <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
            <Label
              htmlFor={plan.id}
              className={`flex flex-col rounded-xl border-2 bg-card p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] 
                ${selectedPlan === plan.id
                  ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                  : 'border-muted hover:border-primary/50'
                }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Plan Icon */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 
                ${selectedPlan === plan.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                  }`}
              >
                {/* <plan.icon className="w-6 h-6" /> */}
              </div>

              {/* Plan Name and Price */}
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold mb-2">{plan.name}</h4>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground text-center mb-4">
                {plan.description}
              </p>

              {/* Features List */}
              <div className="space-y-2">
                {plan.planFeatures?.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Selection Indicator */}
              <div
                className={`mt-4 pt-4 border-t 
                ${selectedPlan === plan.id ? 'border-primary/20' : 'border-muted'}`}
              >
                <div
                  className={`text-center text-sm font-medium 
                  ${selectedPlan === plan.id ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Click to select'}
                </div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
