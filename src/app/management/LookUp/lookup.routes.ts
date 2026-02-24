import { Routes } from '@angular/router';
import { CreateNewLookupmasterComponent } from './components/create-new-lookupmaster/create-new-lookupmaster.component';

const LOOKUP_ROUTES: Routes = [
  {
    path: 'looks-up',
    loadComponent: () =>
      import('./components/lookup-layout/lookup-layout.component')
        .then(m => m.LookupLayoutComponent),
    data: { breadcrumb: 'LookUps' },
    children:[
      {
        path: '',
        loadComponent: () =>
          import('./components/all-looksups/all-looksups.component')
            .then(m => m.AllLooksupsComponent),
        data: { breadcrumb: 'All Lookups' },
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./components/create-new-lookupmaster/create-new-lookupmaster.component')
            .then(m => m.CreateNewLookupmasterComponent),
        data: { breadcrumb: 'Create LookUP' },
      },
    ]
  }
];

export default LOOKUP_ROUTES;
