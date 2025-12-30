export interface EmployeeEvent {
  employeeId: string;
  fullName: string;
  email: string;
  role: string;
  hiredAt: string;
  terminatedAt?: string;
  eventDate: string;
  eventType: string;
}
