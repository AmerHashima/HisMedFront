// patient.updaters.ts
import { PartialStateUpdater } from '@ngrx/signals';
import { PatientState } from '../models/patient-state';
import { ApiPatient } from '../models/api-patient';
import { mapApiPatientsToPatientVMs, mapApiPatientToPatientVM } from './patient.mapper';

export const activateLoading: PartialStateUpdater<PatientState> = () => ({
  loading: true,
});

export const deactivateLoading: PartialStateUpdater<PatientState> = () => ({
  loading: false,
});

export const setError = (error: string | null): PartialStateUpdater<PatientState> => () => ({
  error,
});

export const setPatients = (
  patients: ApiPatient[],
  total: number
): PartialStateUpdater<PatientState> => () => ({
  patients: mapApiPatientsToPatientVMs(patients),
  total,
});

export const setSelectedPatient = (
  patient: ApiPatient
): PartialStateUpdater<PatientState> => () => ({
  selectedPatient: mapApiPatientToPatientVM(patient),
});

export const deletePatient = (id: string): PartialStateUpdater<PatientState> =>
  (state) => ({
    patients: state.patients.filter(p => p.oid !== id),
  });

export const setSearchUpdater = (search: string): PartialStateUpdater<PatientState> =>
  () => ({
    search: search.trim(),
    page: 1,
  });

export const setPageUpdater = (page: number, pageSize?: number): PartialStateUpdater<PatientState> =>
  (state) => ({
    page,
    pageSize: pageSize ?? state.pageSize,
  });

export const setSortUpdater = (
  sortBy: string,
  direction: 'asc' | 'desc' | ''
): PartialStateUpdater<PatientState> => () => ({
  sortBy,
  sortDirection: direction,
  page: 1,
});
export const setSuccess = (success: boolean): PartialStateUpdater<PatientState> => {
  return (state) => ({
    success: success,
  });
};
