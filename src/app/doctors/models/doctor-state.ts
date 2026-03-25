// src\app\doctors\models\doctor-state.ts

import { APIDoctorSchedule, APIDoctorScheduleBulk } from "./doctor-schedule";
import { DoctorVM } from "./doctor-vm";

export interface DoctorState {
  //   doctors:Doctor[]
  // selectedDoctor: Doctor | null;
  doctors: DoctorVM[];
  selectedDoctor: DoctorVM | null;
  // selectedDoctorSchedules: APIDoctorSchedule[],
  // selectedDoctorSchedule: APIDoctorSchedule | null,
  DoctorSchedules: APIDoctorSchedule[],
  selectedDoctorSchedules: APIDoctorScheduleBulk[],
  selectedDoctorSchedule: APIDoctorScheduleBulk | null,
  scheduleSuccess:boolean,
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
