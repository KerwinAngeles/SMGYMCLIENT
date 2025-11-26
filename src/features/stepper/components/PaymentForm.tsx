import {
  Shield,
  CreditCard as CreditCardIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { type FormData } from "../types";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import {getAllPaymentMethods} from "@/features/stepper/services/stepperService";
import { useEffect, useState } from "react";
import { type PaymentMethod } from "@/features/stepper/types";

interface PaymentFormProps {
  formData: FormData;
  errors: Record<string, string>;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  clientSecret?: string;
}


export const PaymentForm = ({
  formData,
  onPaymentMethodChange,
}: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await getAllPaymentMethods();
        console.log("Fetched payment methods:", methods.data);
        console.log("Selected payment method:", formData.paymentMethod.name);
        setPaymentMethods(Array.isArray(methods?.data) ? methods.data : []);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Secure Payment</h3>
        <p className="text-muted-foreground">
          Your payment information is encrypted and secure
        </p>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Choose Payment Method</Label>
        <div className="grid gap-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.paymentMethod.id === method.id
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/50"
                }`}
              onClick={() => onPaymentMethodChange(method)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.paymentMethod.id === method.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                  }`}
              >
              </div>
              <div className="flex-1">
                <div className="font-medium">{method.name}</div>
                <div className="text-sm text-muted-foreground">
                  {method.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card Details via Stripe */}
      {(formData.paymentMethod.name == "Credit Card" ||
        formData.paymentMethod.name == "Debit Card") && (
          <div className="space-y-6 border-t pt-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CreditCardIcon className="w-4 h-4" />
              Card Information
            </div>

            <div className="p-3 text-white border rounded-lg">
              <CardElement options={{
                hidePostalCode: true,
                style: {
                  base: {
                    color: "#ffffff",
                    fontSize: "16px",
                    "::placeholder": {
                      color: "#a0aec0",
                    },
                    iconColor: "#ffffff",
                  },
                  invalid: {
                    color: "#ff4d4f",
                    iconColor: "#ff4d4f",
                  },
                },
              }} />
            </div>
          </div>
        )}

      {/* Cash Payment Notice */}
      {formData.paymentMethod.name == "Cash Payment" && (
        <div className="bg-muted/50 border border-muted rounded-lg p-4">
          {/* <Banknote className="w-4 h-4" />
          <span> Pay in cash at reception </span> */}
          <button
            type="submit"
            disabled={!stripe || !elements}
            className="w-full bg-primary text-gray-900 py-2 rounded-lg"
          >
            Pay Now
          </button>
        </div>
      )}

      {/* Submit Button */}
      {(formData.paymentMethod.name == "Credit Card" ||
        formData.paymentMethod.name == "Debit Card") && (
          <button
            type="submit"
            disabled={!stripe || !elements}
            className="w-full bg-primary text-gray-900 py-2 rounded-lg"
          >
            Pay Now
          </button>
        )}
    </div>
  );
};
