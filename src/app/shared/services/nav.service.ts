// src\app\shared\services\nav.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { NAV_MENU_ITEMS } from '../data/nav-menu-items.data';
import type { Menu } from '../models/menu.model';
export type { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class NavService implements OnDestroy {
  private readonly unsubscriber = new Subject<void>();
  private readonly megaMenuBreakpoint = 1199;
  private readonly sidebarBreakpoint = 991;

  public readonly screenWidth = new BehaviorSubject<number>(window.innerWidth);
  public megaMenu = false;
  public megaMenuCollapse = window.innerWidth < this.megaMenuBreakpoint;
  public collapseSidebar = window.innerWidth < this.sidebarBreakpoint;

  readonly MENUITEMS: Menu[] = this.createMenuItems();
  readonly items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

  constructor(private router: Router) {
    this.initializeResizeHandling();
    this.initializeRouteHandling();
  }

  private initializeResizeHandling(): void {
    this.setScreenWidth(window.innerWidth);

    fromEvent(window, 'resize')
      .pipe(debounceTime(300), takeUntil(this.unsubscriber))
      .subscribe((event: Event) => {
        const width = (event.target as Window).innerWidth;
        this.setScreenWidth(width);

        if (width < this.sidebarBreakpoint) {
          this.collapseSidebar = false;
          this.megaMenu = false;
        }

        this.megaMenuCollapse = width < this.megaMenuBreakpoint;
      });
  }

  private initializeRouteHandling(): void {
    this.router.events
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(() => {
        if (window.innerWidth < this.sidebarBreakpoint) {
          this.collapseSidebar = false;
          this.megaMenu = false;
        }
      });
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  private createMenuItems(): Menu[] {
    return JSON.parse(JSON.stringify(NAV_MENU_ITEMS));
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
