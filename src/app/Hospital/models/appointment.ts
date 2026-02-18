export interface Appointment {
  oid?:string,
  patientId: string,
  doctorId: string,
  appointmentDate: string,
  appointmentType: string,
  status: string,
  reason: string,
  branchId: string
}

export interface APIAppointment {
  oid: string,
  patientId: string,
  doctorId: string,
  patientName: string,
  patientMRN: string,
  doctorName: string,
  specialtyName: string,
  branchName: string,
  appointmentDate: string,
  appointmentType: string,
  status: string,
  reason: string,
  branchId: string,
  createdAt: string,
  updatedAt: string
}


export interface AppointmentVM extends Appointment {
  patientName: string,
  patientMRN: string,
  doctorName: string,
  specialtyName: string,
  branchName: string,
  createdAt: string;
  updatedAt: string;
}


export interface AppointmentState {
  appointments: AppointmentVM[];
  selectedAppointment: AppointmentVM | null;
    success: boolean
    loading: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    total: number;
    search: string;
    sortBy: string;
    sortDirection: 'asc' | 'desc' | '';
}
