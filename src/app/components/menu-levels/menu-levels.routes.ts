import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
      path:'menu-levels',
      children: [
          {
              path: 'level-one',
              loadComponent: () => import('./level-one/level-one.component').then(m => m.LevelOneComponent)
          },
          {
              path: 'level-two',
              loadComponent: () => import('./level-two/level-two.component').then(m => m.LevelTwoComponent)
          }

      ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuLevelsRoutingModule { 
  static routes=routes

}
