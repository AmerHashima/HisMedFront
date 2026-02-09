// import { Patient } from "./patient";
import { PatientVM } from "./patient-vm";

export interface PatientState {
  // patients:Patient[]
  // selectedPatient: Patient | null;
  patients: PatientVM[];
  selectedPatient: PatientVM | null;
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

