import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
      path: '',
      children: [
          {
              path: 'signin', title:"Valex - Signin",
              loadComponent: () => import('./sign-in/sign-in.component').then(m => m.SignInComponent)
          },
          {
              path: 'sign-up', title:"Valex - Sign Up",
              loadComponent: () => import('./sign-up/sign-up.component').then(m => m.SignUpComponent)
          },
          {
              path: 'forgot-password', title:"Valex - Forgot Password",
              loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
          },
          {
            path: 'error404', title:"Valex - Error 404",
            loadComponent: () => import('./error404/error404.component').then(m => m.Error404Component)
          },
         
      ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomPagesRoutingModule { 
  static routes=routes
}
