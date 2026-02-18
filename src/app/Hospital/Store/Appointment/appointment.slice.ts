
import { AppointmentState } from "../../models/appointment";
import { HospitalBranchState } from "../../models/branch";

export const initialAppointmentState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  success: false,
  loading: false,
  error: null,
  page: 1,
  pageSize: 10,
  total: 0,
  search: '',
  sortBy: 'oid',
  sortDirection: 'asc',
};
