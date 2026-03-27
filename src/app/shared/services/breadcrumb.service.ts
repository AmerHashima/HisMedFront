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

  // 👇 NEW
  private breadcrumbClickSubject = new BehaviorSubject<BreadcrumbItem | null>(null);
  breadcrumbClick$ = this.breadcrumbClickSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const root = this.router.routerState.snapshot.root;
      this.breadcrumbsSubject.next(this.buildBreadcrumbs(root));
    });
  }



  setBreadcrumbs(crumbs: BreadcrumbItem[]) {
    this.breadcrumbsSubject.next(crumbs);
  }

  resetToRoute() {
    const root = this.router.routerState.snapshot.root;
    this.breadcrumbsSubject.next(this.buildBreadcrumbs(root));
  }

  notifyBreadcrumbClick(crumb: BreadcrumbItem) {
    this.breadcrumbClickSubject.next(crumb);
  }

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url = '',
    crumbs: BreadcrumbItem[] = []
  ): BreadcrumbItem[] {
    const routeURL = route.url.map(s => s.path).join('/');
    if (routeURL) url += `/${routeURL}`;

    if (route.data['breadcrumb']) {
      crumbs.push({ label: route.data['breadcrumb'], url });
    }

    return route.firstChild
      ? this.buildBreadcrumbs(route.firstChild, url, crumbs)
      : crumbs;
  }
}

