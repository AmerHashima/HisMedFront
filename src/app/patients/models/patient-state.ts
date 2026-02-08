import { Patient } from "./patient";

export interface PatientState {
  patients:Patient[]
  selectedPatient: Patient | null;
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

