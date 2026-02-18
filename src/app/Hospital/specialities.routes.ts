import { Routes } from '@angular/router';

 const SPECIALITIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./Components/Specialities/all-specialities/all-specialities.component')
        .then(m => m.AllSpecialitiesComponent),
    data: { breadcrumb: 'All Specialities' },
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./Components/Specialities/create-new-speciality/create-new-speciality.component')
        .then(m => m.CreateNewSpecialityComponent),
    data: { breadcrumb: 'Create Speciality' },
  },
];

export default SPECIALITIES_ROUTES;
