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
      {
        path: 'create',
        loadComponent: () =>
          import('./component/create-doctor/create-doctor.component')
            .then(m => m.CreateDoctorComponent),
        data: { breadcrumb: 'Create Doctor' }

      },
    ],
  },
];
