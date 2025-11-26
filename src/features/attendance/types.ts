export interface AttendanceRequest {
  clientId: number;
  accessCode?: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;
}

export interface AttendanceRecord {
  id: number;
  clientId: number;
  fullName: string;
  email: string;
  phone: string;
  accessCode: string;
  checkInTime: Date;
  status: string;
  notes?: string;
}

export interface AttendanceSummary {
  totalDays: number;
  totalThisWeek: number;
  totalThisMonth: number;
}
