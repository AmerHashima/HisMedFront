// src\app\management\user\user.routes.ts
import { Routes } from '@angular/router';
import { PatientsComponent } from '../patients/component/patients/patients.component';

export const PATIENTS_ROUTES: Routes = [
  {
    path: 'patients',
    loadComponent: () =>
      import('./component/patients-layout/patients-layout.component')
        .then(m => m.PatientsLayoutComponent),
    data: { breadcrumb: 'Patients' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./component/patients/patients.component')
            .then(m => m.PatientsComponent),
      },
    ],
  },
];
