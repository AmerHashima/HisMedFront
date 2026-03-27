import { DoctorsComponent } from './component/doctors/doctors.component';
import { Routes } from '@angular/router';

export const DOCTOR_ROUTES: Routes = [
  {
    path: 'doctors',
    loadComponent: () =>
      import('./component/doctors-layout/doctors-layout.component')
        .then(m => m.DoctorsLayoutComponent),
    data: { breadcrumb: 'Doctors' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./component/doctors/doctors.component')
            .then(m => m.DoctorsComponent),
      },
      // {
      //   path: 'create',
      //   loadComponent: () =>
      //     import('./component/create-doctor/create-doctor.component')
      //       .then(m => m.CreateDoctorComponent),
      //   data: { breadcrumb: 'Add Doctor' }
      // },
      {
        path: 'schedules',
        data: { breadcrumb: 'Schedules' },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./component/doctor-schedules/doctor-schedules.component')
                .then(m => m.DoctorSchedulesComponent),
          },

          // {
          //   path: 'create',
          //   loadComponent: () =>
          //     import('./component/doctor-schedule/doctor-schedule.component')
          //       .then(m => m.DoctorScheduleComponent),
          //   data: { breadcrumb: 'Add Schedule' }
          // }

        ]
      },

      {
        path: 'exceptions',
        data: { breadcrumb: 'Exceptions' },
        children: [

          {
            path: '',
            loadComponent: () =>
              import('./component/doctor-schedule-exception-list/doctor-schedule-exception-list.component')
                .then(m => m.DoctorScheduleExceptionListComponent),
          },

          // {
          //   path: 'create',
          //   loadComponent: () =>
          //     import('./component/doctor-schedule-exception/doctor-schedule-exception.component')
          //       .then(m => m.DoctorScheduleExceptionComponent),
          //   data: { breadcrumb: 'Add Exception' }
          // }

        ]
      }
    ],
  },
];
