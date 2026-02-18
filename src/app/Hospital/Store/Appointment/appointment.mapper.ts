import { APIAppointment, Appointment, AppointmentVM } from "../../models/appointment";

/** Map API model → Domain model */
export function mapApiAppointmentToAppointment(api: APIAppointment): Appointment {
  return {
    oid: api.oid,
    patientId: api.patientId,
    doctorId: api.doctorId,
    appointmentDate: api.appointmentDate,
    appointmentType: api.appointmentType,
    status: api.status,
    reason: api.reason,
    branchId: api.branchId,
  };
}

/** Map API model → View model */
export function mapApiAppointmentToAppointmentVM(api: APIAppointment): AppointmentVM {
  return {
    oid: api.oid,
    patientId: api.patientId,
    doctorId: api.doctorId,
    appointmentDate: api.appointmentDate,
    appointmentType: api.appointmentType,
    status: api.status,
    reason: api.reason,
    branchId: api.branchId,

    // Extra fields for UI display
    patientName: api.patientName,
    patientMRN: api.patientMRN,
    doctorName: api.doctorName,
    specialtyName: api.specialtyName,
    branchName: api.branchName,

    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

/** Map API array → Domain model array */
export const mapApiAppointmentsToAppointments = (
  appointments: APIAppointment[]
): Appointment[] => appointments.map(mapApiAppointmentToAppointment);

/** Map API array → View model array */
export const mapApiAppointmentsToAppointmentVMs = (
  appointments: APIAppointment[]
): AppointmentVM[] => appointments.map(mapApiAppointmentToAppointmentVM);
