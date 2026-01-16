import { Routes } from '@angular/router';
import { DashboardRoutingModule } from 'src/app/components/dashboard/dashboard.routes';
import { MenuLevelsRoutingModule } from 'src/app/components/menu-levels/menu-levels.routes';
import { PagesRoutingModule } from 'src/app/components/pages/pages.routes';
import { USERS_ROUTES } from 'src/app/management/user/user.routes';

export const Full_Content_Routes: Routes = [

  {
    path:'',
    children:[
      ...DashboardRoutingModule.routes,
      ...PagesRoutingModule.routes,
      ...MenuLevelsRoutingModule.routes,
      ...USERS_ROUTES
    ]
  }
];
