import { Doctor } from "./doctor";

export interface DoctorState {
    doctors:Doctor[]
  selectedDoctor: Doctor | null;
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
