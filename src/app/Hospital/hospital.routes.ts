import { Routes } from '@angular/router';

export const HOSPITAL_ROUTES: Routes = [
  {
    path: 'hospital',
    loadComponent: () =>
      import('./Components/hospital-layout/hospital-layout.component')
        .then(m => m.HospitalLayoutComponent),
    data: { breadcrumb: 'Hospital' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./Components/hospital/hospital.component')
            .then(m => m.HospitalComponent),
      },
      {
        path: 'branches',
        loadChildren: () => import('./branches.routes').then(m => m.default),
      },
      {
        path: 'specialities',
        loadChildren: () =>
          import('./specialities.routes').then(m => m.default),
      },
      {
        path: 'appointments',
        loadChildren: () =>
          import('./appointments.routes').then(m => m.default),
      },
    ],
  },
];
