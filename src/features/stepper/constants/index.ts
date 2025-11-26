import { 
  User,
  CreditCard,
  DumbbellIcon
} from 'lucide-react';

import {type StepInfo } from '../types';

export const STEPS: StepInfo[] = [
  { 
    id: 'client', 
    label: 'Personal Info', 
    description: 'Your details',
    icon: User
  },
  { 
    id: 'plan', 
    label: 'Choose Plan', 
    description: 'Membership type',
    icon: DumbbellIcon
  },
  { 
    id: 'payment', 
    label: 'Payment', 
    description: 'Secure checkout',
    icon: CreditCard
  },
];
