import { Routes } from '@angular/router';

const APPOINTMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./Components/Appointments/all-appointments/all-appointments.component')
        .then(m => m.AllAppointmentsComponent),
    data: { breadcrumb: 'All Appointments' },
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./Components/Appointments/create-new-appointment/create-new-appointment.component')
        .then(m => m.CreateNewAppointmentComponent),
    data: { breadcrumb: 'Create Appointment' },
  },
];

export default APPOINTMENTS_ROUTES;
