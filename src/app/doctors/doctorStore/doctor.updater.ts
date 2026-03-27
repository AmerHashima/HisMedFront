// doctor.updaters.ts
import { PartialStateUpdater } from '@ngrx/signals';
import { DoctorState } from '../models/doctor-state';
import { mapApiDoctorsToDoctorVMs, mapApiDoctorToDoctorVM, mapBulKScheduleToApiSchedule } from './doctor.mapper';
import { ApiDocor } from '../models/api-docor';
import { APIDoctorSchedule, APIDoctorScheduleBulk, APIDoctorScheduleItem, DoctorScheduleBulk } from '../models/doctor-schedule';

// export const activateLoading: PartialStateUpdater<DoctorState> = () => ({ loading: true });
// export const deactivateLoading: PartialStateUpdater<DoctorState> = () => ({ loading: false });

export const activateLoading: PartialStateUpdater<DoctorState> = () => {
  console.log('🟢 STORE LOADING = TRUE');
  return { loading: true };
};

export const deactivateLoading: PartialStateUpdater<DoctorState> = () => {
  console.log('🔴 STORE LOADING = FALSE');
  return { loading: false };
};

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

// export const setSelectedDoctoSchedule = (
//   schedule: APIDoctorSchedule
// ): PartialStateUpdater<DoctorState> => () => ({
//   selectedDoctorSchedule: schedule,
// });

export const deleteFullDoctorSchedule = (ids: string[]): PartialStateUpdater<DoctorState> =>
  (state) => ({
    selectedDoctorSchedules: state.selectedDoctorSchedules.filter(
      s => !ids.includes(s.oid)
    ),

    // optional (if used elsewhere)
    DoctorSchedules: state.DoctorSchedules.filter(
      s => !ids.includes(s.oid)
    )
  });

export const setSelectedDoctoSchedule = (
  schedule: APIDoctorScheduleBulk
): PartialStateUpdater<DoctorState> => () => ({
  selectedDoctorSchedule: schedule,
});


// export const setSelectedDoctoSchedules = (
//   schedules: APIDoctorSchedule[]
// ): PartialStateUpdater<DoctorState> => () => ({
//   selectedDoctorSchedules: schedules,
// });

export const setSelectedDoctoSchedules = (
  schedules: APIDoctorScheduleBulk[]
): PartialStateUpdater<DoctorState> => () => ({
  selectedDoctorSchedules: schedules,
});

export const setDoctoSchedules = (
  schedules: APIDoctorSchedule[]
): PartialStateUpdater<DoctorState> => () => ({
  DoctorSchedules: schedules,
});



export const deleteDoctor = (id: string): PartialStateUpdater<DoctorState> =>
  (state) => ({
    doctors: state.doctors.filter(d => d.oid !== id),
  });
export const deleteDoctorSchedule = (id: string): PartialStateUpdater<DoctorState> =>
  (state) => ({
    DoctorSchedules: state.DoctorSchedules.filter(d => d.oid !== id),
  });

// export const deleteDetailDoctorSchedule = (id: string): PartialStateUpdater<DoctorState> =>
//   (state) => {

//     const schedule = state.selectedDoctorSchedule;

//     if (!schedule) return state;

//     return {
//       selectedDoctorSchedule: {
//         ...schedule,
//         details: schedule.details.filter(d => d.oid !== id)
//       }
//     };
//   };

export const deleteDetailDoctorSchedule = (id: string): PartialStateUpdater<DoctorState> =>
  (state) => {

    const selected = state.selectedDoctorSchedule;
    const list = state.selectedDoctorSchedules;

    return {
      selectedDoctorSchedule: selected
        ? {
          ...selected,
          details: selected.details.filter(d => d.oid !== id)
        }
        : selected,

      selectedDoctorSchedules: list.map(schedule => ({
        ...schedule,
        details: schedule.details.filter(d => d.oid !== id)
      }))
    };
  };

export const updateDetailDoctorSchedule = (
  updatedItem: APIDoctorScheduleItem
): PartialStateUpdater<DoctorState> =>
  (state) => {

    const schedule = state.selectedDoctorSchedule;
    if (!schedule) return state;

    const exists = schedule.details.some(d => d.oid === updatedItem.oid);

    return {
      selectedDoctorSchedule: {
        ...schedule,
        details: exists
          // ✅ UPDATE
          ? schedule.details.map(d =>
            d.oid === updatedItem.oid ? { ...d, ...updatedItem } : d
          )
          // ✅ ADD NEW
          : [
            updatedItem,
            ...schedule.details
          ]
      }
    };
  };

// export const addDetailDoctorSchedules = (
//   items: APIDoctorScheduleItem[]
// ): PartialStateUpdater<DoctorState> =>
//   (state) => {

//     const schedule = state.selectedDoctorSchedule;
//     if (!schedule) return state;

//     return {
//       selectedDoctorSchedule: {
//         ...schedule,
//         details: [
//           ...items, // ✅ all new
//           ...schedule.details
//         ]
//       }
//     };
//   };

export const addDetailDoctorSchedules = (
  items: APIDoctorScheduleItem[]
): PartialStateUpdater<DoctorState> =>
  (state) => {

    const schedule = state.selectedDoctorSchedule;
    if (!schedule) return state;

    // ✅ map day name
    const mappedItems = items.map(item => ({
      ...item,
      dayOfWeekNameEn:
        schedule.details.find(d => d.dayOfWeekId === item.dayOfWeekId)?.dayOfWeekNameEn
        || 'Unknown'
    }));

    const updatedDetails = [
      ...mappedItems,
      ...schedule.details
    ];

    const updatedDoctorSchedules = state.selectedDoctorSchedules.map(s =>
      s.oid === schedule.oid
        ? {
          ...s,
          details: [
            ...mappedItems,
            ...(s.details ?? [])
          ]
        }
        : s
    );

    return {
      selectedDoctorSchedule: {
        ...schedule,
        details: updatedDetails
      },
      selectedDoctorSchedules: updatedDoctorSchedules
    };
  };

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

export const setScheduleSuccess = (success: boolean): PartialStateUpdater<DoctorState> => {
  return (state) => ({
    scheduleSuccess: success,
  });
};



export const updateDoctorSchedule = (
  body:any,
  schedule: APIDoctorScheduleBulk
): PartialStateUpdater<DoctorState> =>
  (state) => {

    const mapped = mapBulKScheduleToApiSchedule( body, schedule  );

    return {
      selectedDoctorSchedules: state.selectedDoctorSchedules.map(s =>
        s.oid === schedule.oid ? schedule : s
      ),

      selectedDoctorSchedule: schedule,

      DoctorSchedules: state.DoctorSchedules.map(s =>
        s.oid === schedule.oid ? mapped : s
      )
    };
  };



export const updateDoctorSchedules = (
  body: DoctorScheduleBulk,
  schedule: APIDoctorScheduleBulk,
): PartialStateUpdater<DoctorState> =>
  (state) => {

    const mapped = mapBulKScheduleToApiSchedule(body, schedule);

    return {
      DoctorSchedules: [
        mapped,
        ...state.DoctorSchedules
      ],
      selectedDoctorSchedules: [
        ...state.selectedDoctorSchedules,
        schedule
      ],
    };
  };





// export const addDoctorSchedule = (
//   schedules: APIDoctorScheduleBulk
// ): PartialStateUpdater<DoctorState> =>
//   (state) => ({
//     selectedDoctorSchedules: [
//       ...state.selectedDoctorSchedules,
//       schedules
//     ],
//   });

