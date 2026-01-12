import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    {
        path: 'dashboard',
        children: [
            {
                path: '', title:"Valex - Dashboard",
                loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {
    static routes=routes
 }
