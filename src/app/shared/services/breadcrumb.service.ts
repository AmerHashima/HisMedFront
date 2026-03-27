// import { Injectable } from '@angular/core';
// import { Router, ActivatedRouteSnapshot } from '@angular/router';
// import { BehaviorSubject } from 'rxjs';

// export interface BreadcrumbItem {
//   label: string;
//   url: string;
//   action?: {
//     type: 'viewMode' | 'hidden';
//     value: any;
//     extra?: any;
//   };
// }

// @Injectable({ providedIn: 'root' })
// export class BreadcrumbService {
//   private breadcrumbsSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
//   breadcrumbs$ = this.breadcrumbsSubject.asObservable();

//   // 👇 NEW
//   private breadcrumbClickSubject = new BehaviorSubject<BreadcrumbItem | null>(null);
//   breadcrumbClick$ = this.breadcrumbClickSubject.asObservable();

//   constructor(private router: Router) {
//     this.router.events.subscribe(() => {
//       const root = this.router.routerState.snapshot.root;
//       this.breadcrumbsSubject.next(this.buildBreadcrumbs(root));
//     });
//   }



//   setBreadcrumbs(crumbs: BreadcrumbItem[]) {
//     this.breadcrumbsSubject.next(crumbs);
//   }

//   resetToRoute() {
//     const root = this.router.routerState.snapshot.root;
//     this.breadcrumbsSubject.next(this.buildBreadcrumbs(root));
//   }

//   notifyBreadcrumbClick(crumb: BreadcrumbItem) {
//     console.log('SERVICE EMIT', crumb);
//     this.breadcrumbClickSubject.next(crumb);
//   }

//   private buildBreadcrumbs(
//     route: ActivatedRouteSnapshot,
//     url = '',
//     crumbs: BreadcrumbItem[] = []
//   ): BreadcrumbItem[] {
//     const routeURL = route.url.map(s => s.path).join('/');
//     if (routeURL) url += `/${routeURL}`;

//     if (route.data['breadcrumb']) {
//       crumbs.push({ label: route.data['breadcrumb'], url });
//     }

//     return route.firstChild
//       ? this.buildBreadcrumbs(route.firstChild, url, crumbs)
//       : crumbs;
//   }
// }



import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {

  private breadcrumbsSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const root = this.router.routerState.snapshot.root;
      this.breadcrumbsSubject.next(this.buildBreadcrumbs(root));
    });
  }

  resetToRoute() {
    const root = this.router.routerState.snapshot.root;
    this.breadcrumbsSubject.next(this.buildBreadcrumbs(root));
  }

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url = '',
    crumbs: BreadcrumbItem[] = []
  ): BreadcrumbItem[] {

    const routeURL = route.url.map(s => s.path).join('/');
    if (routeURL) url += `/${routeURL}`;

    if (route.data['breadcrumb']) {
      crumbs.push({
        label: route.data['breadcrumb'],
        url
      });
    }

    // 🔥 ADD THIS PART
    if (!route.firstChild) {
      const queryParams = route.queryParams;

      if (queryParams['mode']) {
        let label = '';

        switch (queryParams['mode']) {
          case 'create':
            label = 'Add';
            break;

          case 'edit':
            label = 'Edit';
            break;

          case 'details':
            label = 'Details';
            break;

          case 'master':
            label = queryParams['code']
              ? 'Edit Lookup'
              : 'Add Lookup';
            break;

          case 'schedule':
            label = 'Schedule';
            break;
        }

        if (label) {
          crumbs.push({
            label,
            url: ''
          });
        }
      }
    }

    return route.firstChild
      ? this.buildBreadcrumbs(route.firstChild, url, crumbs)
      : crumbs;
  }
}
