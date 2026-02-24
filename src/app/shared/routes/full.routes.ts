import { Routes } from '@angular/router';
import { DashboardRoutingModule } from 'src/app/components/dashboard/dashboard.routes';
import { MenuLevelsRoutingModule } from 'src/app/components/menu-levels/menu-levels.routes';
import { PagesRoutingModule } from 'src/app/components/pages/pages.routes';
import { DOCTOR_ROUTES } from 'src/app/doctors/doctor.routes';
import { HOSPITAL_ROUTES } from 'src/app/Hospital/hospital.routes';
import LOOKUP_ROUTES from 'src/app/management/LookUp/lookup.routes';
import { USERS_ROUTES } from 'src/app/management/user/user.routes';
import { PATIENTS_ROUTES } from 'src/app/patients/patient.routes';

export const Full_Content_Routes: Routes = [

  {
    path:'',
    children:[
      ...DashboardRoutingModule.routes,
      ...PagesRoutingModule.routes,
      ...MenuLevelsRoutingModule.routes,
      ...USERS_ROUTES,
      ...PATIENTS_ROUTES,
      ...DOCTOR_ROUTES,
      ...HOSPITAL_ROUTES,
      ...LOOKUP_ROUTES
    ]
  }
];
