import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { planService } from '@/features/plans/services/planService';
import { type EditPlanRequest } from '@/features/plans/types';
import { type Membership } from '../types';
import { type RenewalData, getClientByName } from '../services/membershipService';

interface MembershipRenewalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membership: Membership | null;
  onRenewalSubmit: (renewalData: RenewalData) => void;
}

export function MembershipRenewalModal({
  open,
  onOpenChange,
  membership,
  onRenewalSubmit
}: MembershipRenewalModalProps) {
  const [plans, setPlans] = useState<EditPlanRequest[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<EditPlanRequest | null>(null);
   const [loading] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchPlans();
    }
  }, [open]);

  useEffect(() => {
    if (selectedPlan && membership) {
      calculateDates();
    }
  }, [selectedPlan, membership]);

  const fetchPlans = async () => {
    try {
      setPlanLoading(true);
      const response = await planService.getAllPlans();
      setPlans(response);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Error al cargar los planes disponibles');
    } finally {
      setPlanLoading(false);
    }
  };

  const calculateDates = () => {
    if (!selectedPlan || !membership) return;
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + selectedPlan.duration);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const handlePlanSelect = (planId: string) => {
    const plan = plans.find(p => p.id.toString() === planId);
    setSelectedPlan(plan || null);
  };

  const handleSubmit = async () => {
    if (!selectedPlan || !membership) {
      toast.error('Por favor selecciona un plan');
      return;
    }

    const dates = calculateDates();
    if (!dates) return;

    // Debug: Log the membership data to see what's available
    console.log('Membership data:', membership);
    console.log('Selected plan:', selectedPlan);

    let clientId = membership.clientId;
    
    // If clientId is not available, try to get it from the client name
    if (!clientId || clientId === 0) {
      try {
        console.log('ClientId not available, trying to get from client name:', membership.clientName);
        const clientData = await getClientByName(membership.clientName);
        if (clientData && clientData.id) {
          clientId = clientData.id;
          console.log('Found clientId:', clientId);
        } else {
          toast.error('No se pudo encontrar el ID del cliente');
          return;
        }
      } catch (error) {
        console.error('Error getting client by name:', error);
        toast.error('Error al obtener información del cliente');
        return;
      }
    }

    const renewalData: RenewalData = {
      membershipId: membership.id,
      clientId: clientId,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      planPrice: selectedPlan.price,
      startDate: dates.startDate,
      endDate: dates.endDate,
      duration: selectedPlan.duration,
      features: selectedPlan.planFeatures || []
    };

    console.log('Renewal data being sent:', renewalData);
    onRenewalSubmit(renewalData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (!membership) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Renovar Membresía
          </DialogTitle>
          <DialogDescription>
            Renueva la membresía de <strong>{membership.clientName}</strong> seleccionando un nuevo plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Membership Info */}
          <Card className="border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Membresía Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{membership.planName}</span>
                <Badge variant={membership.statusName === 'Active' ? 'default' : 'secondary'}>
                  {membership.statusName}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Vence: {formatDate(membership.endDate)}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Plan Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan-select">Seleccionar Plan de Renovación</Label>
              <Select onValueChange={handlePlanSelect} disabled={planLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={planLoading ? "Cargando planes..." : "Selecciona un plan"} />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span>{plan.name}</span>
                        <span className="ml-4 text-sm text-muted-foreground">
                          {formatCurrency(plan.price)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Plan Details */}
            {selectedPlan && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {selectedPlan.name}
                    <Badge variant="outline" className="text-primary border-primary">
                      {formatCurrency(selectedPlan.price)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {selectedPlan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Plan Features */}
                  {selectedPlan.planFeatures && selectedPlan.planFeatures.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Características del Plan:</Label>
                      <div className="grid grid-cols-1 gap-1">
                        {selectedPlan.planFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Plan Duration */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Duración: {selectedPlan.duration} días</span>
                  </div>

                  {/* Calculated Dates */}
                  {(() => {
                    const dates = calculateDates();
                    return dates ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Fecha de inicio: {formatDate(dates.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Fecha de vencimiento: {formatDate(dates.endDate)}</span>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedPlan || loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? "Procesando..." : "Continuar al Pago"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
