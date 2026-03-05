// src\app\doctors\models\doctor-state.ts

import { DoctorVM } from "./doctor-vm";

export interface DoctorState {
  //   doctors:Doctor[]
  // selectedDoctor: Doctor | null;
  doctors: DoctorVM[];
  selectedDoctor: DoctorVM | null;
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
