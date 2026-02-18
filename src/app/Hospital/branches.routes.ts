import { Routes } from '@angular/router';

const BRANCH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./Components/Branches/all-branches/all-branches.component')
        .then(m => m.AllBranchesComponent),
    data: { breadcrumb: 'All Branches' },
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./Components/Branches/create-new-branch/create-new-branch.component')
        .then(m => m.CreateNewBranchComponent),
    data: { breadcrumb: 'Create Branch' },
  },
];

export default BRANCH_ROUTES;
