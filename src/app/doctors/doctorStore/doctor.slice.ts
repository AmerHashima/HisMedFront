
import { DoctorState } from "../models/doctor-state";

export const initialDoctorState: DoctorState = {
  doctors: [],
  selectedDoctor: null,
success:false,
  loading: false,
  error: null,
  page: 1,
  pageSize: 10,
  total: 0,
  search: '',
  sortBy: 'oid',
  sortDirection: 'asc',
};
