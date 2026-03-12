// doctor.updaters.ts
import { PartialStateUpdater } from '@ngrx/signals';
import { DoctorState } from '../models/doctor-state';
import { mapApiDoctorsToDoctorVMs, mapApiDoctorToDoctorVM } from './doctor.mapper';
import { ApiDocor } from '../models/api-docor';
import { APIDoctorSchedule } from '../models/doctor-schedule';

export const activateLoading: PartialStateUpdater<DoctorState> = () => ({ loading: true });
export const deactivateLoading: PartialStateUpdater<DoctorState> = () => ({ loading: false });

export const setError = (error: string | null): PartialStateUpdater<DoctorState> => () => ({ error });

export const setDoctors = (
  doctors: ApiDocor[],
  total: number
): PartialStateUpdater<DoctorState> => () => ({
  doctors: mapApiDoctorsToDoctorVMs(doctors),
  total,
});

export const setSelectedDoctor = (
  doctor: ApiDocor
): PartialStateUpdater<DoctorState> => () => ({
  selectedDoctor: mapApiDoctorToDoctorVM(doctor),
});

export const setSelectedDoctoSchedule = (
  schedule: APIDoctorSchedule
): PartialStateUpdater<DoctorState> => () => ({
  selectedDoctorSchedule: schedule,
});

export const setSelectedDoctoSchedules = (
  schedules: APIDoctorSchedule[]
): PartialStateUpdater<DoctorState> => () => ({
  selectedDoctorSchedules: schedules,
});


export const deleteDoctor = (id: string): PartialStateUpdater<DoctorState> =>
  (state) => ({
    doctors: state.doctors.filter(d => d.oid !== id),
  });
export const deleteDoctorSchedule = (id: string): PartialStateUpdater<DoctorState> =>
  (state) => ({
    selectedDoctorSchedules: state.selectedDoctorSchedules.filter(d => d.oid !== id),
  });

export const setSearchUpdater = (search: string): PartialStateUpdater<DoctorState> =>
  () => ({ search: search.trim(), page: 1 });

export const setPageUpdater = (page: number, pageSize?: number): PartialStateUpdater<DoctorState> =>
  (state) => ({ page, pageSize: pageSize ?? state.pageSize });

export const setSortUpdater = (
  sortBy: string,
  direction: 'asc' | 'desc' | ''
): PartialStateUpdater<DoctorState> => () => ({ sortBy, sortDirection: direction, page: 1 });

export const setSuccess = (success: boolean): PartialStateUpdater<DoctorState> => {
  return (state) => ({
    success: success,
  });
};
