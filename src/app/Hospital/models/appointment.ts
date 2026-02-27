import { BaseCrudState } from "src/app/common/Models/base-crud-state";

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
  oid:string,
  patientName: string,
  patientMRN: string,
  doctorName: string,
  specialtyName: string,
  branchName: string,
  createdAt: string;
  updatedAt: string;
}

export type AppointmentState = BaseCrudState<AppointmentVM>;
