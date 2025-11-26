import { User, Mail, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type FormData } from '../types';
interface ClientFormProps {
  formData: FormData;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ClientForm = ({ formData, errors, onInputChange }: ClientFormProps) => {

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Let's get to know you</h3>
        <p className="text-muted-foreground">
          Please provide your details to create your membership
        </p>
      </div>

      {/* Personal Information */}
      <div className="space-y-6">
        <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <User className="w-4 h-4" />
          Personal Information
        </h4>
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.client.fullName}
            onChange={onInputChange}
            placeholder="Enter your full name"
            className={errors.fullName? "border-destructive" : ""}
            aria-invalid={!!errors.fullName}
            aria-describedby="fullName-error"
          />
          {errors.fullName && (
            <p id="fullName-error" className="text-sm text-destructive">
              {errors.fullName}
            </p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Mail className="w-4 h-4" />
          Contact Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.client.email}
              onChange={onInputChange}
              placeholder="your.email@example.com"
              className={errors.email ? "border-destructive" : ""}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.client.phoneNumber}
              onChange={onInputChange}
              placeholder="+1 (555) 123-4567"
              className={errors.phoneNumber ? "border-destructive" : ""}
              aria-invalid={!!errors.phoneNumber}
              aria-describedby="phone-error"
            />
            {errors.phoneNumber && (
              <p id="phone-error" className="text-sm text-destructive">{errors.phoneNumber}</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-6">
        <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Calendar className="w-4 h-4" />
          Additional Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nationalId">National ID</Label>
            <Input
              id="nationalId"
              name="nationalId"
              value={formData.client.nationalId}
              onChange={onInputChange}
              placeholder="Enter your national ID"
              className={errors.nationalId ? "border-destructive" : ""}
              aria-invalid={!!errors.nationalId}
              aria-describedby="nationalId-error"
            />
            {errors.nationalId && (
              <p id="nationalId-error" className="text-sm text-destructive">
                {errors.nationalId}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDay">Date of Birth</Label>
            <Input
              id="birthDay"
              type="date"
              name="birthDay"
              value={formData.client.birthDay}
              onChange={onInputChange}
              className={errors.birthDay ? "border-destructive" : ""}
              aria-invalid={!!errors.birthDay}
              aria-describedby="birthDay-error"
            />
            {errors.birthDay && (
              <p id="birthDay-error" className="text-sm text-destructive">
                {errors.birthDay}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
