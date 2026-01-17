import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('./components/users-layout/users-layout.component')
        .then(m => m.UsersLayoutComponent),
    data: { breadcrumb: 'Users' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/users/users.component')
            .then(m => m.UsersComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./components/create-user/create-user.component')
            .then(m => m.CreateUserComponent),
        data: { breadcrumb: 'Create User' }

      },
      {
        path: 'edit',
        loadComponent: () =>
          import('./components/edit-user/edit-user.component')
            .then(m => m.EditUserComponent),
        data: { breadcrumb: 'Edit User' }

      },
      {
        path: 'user/:id',
        loadComponent: () =>
          import('./components/user/user.component')
            .then(m => m.UserComponent),
        data: { breadcrumb: 'User' }

      },

    ],
  },
];
