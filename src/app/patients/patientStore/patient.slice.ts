import { PatientState } from "../models/patient-state";


export const initialPatientState: PatientState = {
  patients: [],
  selectedPatient: null,
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
