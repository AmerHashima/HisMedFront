import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

//Menu Bar
export interface Menu {
  headTitle?: string;
  title?: string;
  path?: string;
  icon?: string;
  dirchange?: boolean;
  type?: string;
  badgeClass?: string;
  badgeValue?: string;
  active?: boolean;
  children?: Menu[];
  Menusub?: boolean;
  open?: boolean;
  items?: any;
  selected?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth
  );

  public megaMenu: boolean = false;
  public megaMenuCollapse: boolean = window.innerWidth < 1199 ? true : false;
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  constructor(private router: Router) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerwidth < 991) {
          this.collapseSidebar = false;
          this.megaMenu = false;
        }

        if (evt.target.innerWidth < 1199) {
          this.megaMenuCollapse = true;
        }
      });
    if (window.innerWidth < 991) {
      this.router.events.subscribe(() => {
        this.collapseSidebar = false;
        this.megaMenu = false;
      });
    }
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  ngOnDestroy() {
    this.unsubscriber.next(true);
    this.unsubscriber.complete();
  }

  MENUITEMS: Menu[] = [
    {
      headTitle: 'Main',
    },
    {
      path: '/dashboard',
      title: 'Index',
      dirchange: false,
      type: 'link',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0V0z" fill="none"></path>
      <path d="M5 5h4v6H5zm10 8h4v6h-4zM5 17h4v2H5zM15 5h4v2h-4z" opacity=".3"></path>
      <path d="M3 13h8V3H3v10zm2-8h4v6H5V5zm8 16h8V11h-8v10zm2-8h4v6h-4v-6zM13 3v6h8V3h-8zm6 4h-4V5h4v2zM3 21h8v-6H3v6zm2-4h4v2H5v-2z"></path></svg>`,
      badgeClass: 'success',
      badgeValue: '1',
      active: true,
   
    },
    
    {
      headTitle: 'MULTI LEVELS',
    },
    {
      title: 'Menu-levels',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M5 9h14V5H5v4zm2-3.5c.83 0 1.5.67 1.5 1.5S7.83 8.5 7 8.5 5.5 7.83 5.5 7 6.17 5.5 7 5.5zM5 19h14v-4H5v4zm2-3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z" opacity=".3"></path><path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zm-1 6H5v-4h14v4zm-12-.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zm-1 6H5V5h14v4zM7 8.5c.83 0 1.5-.67 1.5-1.5S7.83 5.5 7 5.5 5.5 6.17 5.5 7 6.17 8.5 7 8.5z"></path></svg>`,
      dirchange: false,
      type: 'sub',
      active: false,
      children: [
        {
          title: 'level-1',
          dirchange: false,
          type: 'empty',
          active: false,
          selected: false,
          path: '/level-menu/level-1',
        },
        {
          title: 'Level-2',
          dirchange: false,
          type: 'sub',
          active: false,
          children: [
            {
              title: 'level-1',
              dirchange: false,
              type: 'empty',
              active: false,
              selected: false,
              path: '/level-menu/level-1',
            },
            {
              title: 'level-2',
              dirchange: false,
              type: 'sub',
              selected: false,
              children: [
                {
                  title: 'level-2.1',
                  dirchange: false,
                  type: 'empty',
                  active: false,
                  selected: false,
                  path: '/level-menu/level-2/level-2-1',
                },
                {
                  title: 'level-2.2',
                  dirchange: false,
                  type: 'empty',
                  active: false,
                  selected: false,
                  path: '/level-menu/level-2/level-2-2',
                },
              ],
            },
          ],
        },
      ],
    },
 
    {
      title: 'Pages',
      icon:`<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" class="side-menu__icon" viewBox="0 0 24 24"><g></g><g><g></g><g><path d="M21,5c-1.11-0.35-2.33-0.5-3.5-0.5c-1.95,0-4.05,0.4-5.5,1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45,4.9,1,6v14.65 c0,0.25,0.25,0.5,0.5,0.5c0.1,0,0.15-0.05,0.25-0.05C3.1,20.45,5.05,20,6.5,20c1.95,0,4.05,0.4,5.5,1.5c1.35-0.85,3.8-1.5,5.5-1.5 c1.65,0,3.35,0.3,4.75,1.05c0.1,0.05,0.15,0.05,0.25,0.05c0.25,0,0.5-0.25,0.5-0.5V6C22.4,5.55,21.75,5.25,21,5z M3,18.5V7 c1.1-0.35,2.3-0.5,3.5-0.5c1.34,0,3.13,0.41,4.5,0.99v11.5C9.63,18.41,7.84,18,6.5,18C5.3,18,4.1,18.15,3,18.5z M21,18.5 c-1.1-0.35-2.3-0.5-3.5-0.5c-1.34,0-3.13,0.41-4.5,0.99V7.49c1.37-0.59,3.16-0.99,4.5-0.99c1.2,0,2.4,0.15,3.5,0.5V18.5z"></path><path d="M11,7.49C9.63,6.91,7.84,6.5,6.5,6.5C5.3,6.5,4.1,6.65,3,7v11.5C4.1,18.15,5.3,18,6.5,18 c1.34,0,3.13,0.41,4.5,0.99V7.49z" opacity=".3"></path></g><g><path d="M17.5,10.5c0.88,0,1.73,0.09,2.5,0.26V9.24C19.21,9.09,18.36,9,17.5,9c-1.28,0-2.46,0.16-3.5,0.47v1.57 C14.99,10.69,16.18,10.5,17.5,10.5z"></path><path d="M17.5,13.16c0.88,0,1.73,0.09,2.5,0.26V11.9c-0.79-0.15-1.64-0.24-2.5-0.24c-1.28,0-2.46,0.16-3.5,0.47v1.57 C14.99,13.36,16.18,13.16,17.5,13.16z"></path><path d="M17.5,15.83c0.88,0,1.73,0.09,2.5,0.26v-1.52c-0.79-0.15-1.64-0.24-2.5-0.24c-1.28,0-2.46,0.16-3.5,0.47v1.57 C14.99,16.02,16.18,15.83,17.5,15.83z"></path></g></g></svg>`,
      dirchange: false,
      type: 'sub',
      active: false,
      children: [
        
        {
          title: 'Custom Pages',
          dirchange: false,
          type: 'sub',
          active: false,
          children: [
            {
              path: '/custompages/signin',
              title: 'Sign in',
              dirchange: false,
              type: 'link',
              active: false,
          selected: false,
            },
            {
              path: '/custompages/sign-up',
              title: 'Sign up',
              dirchange: false,
              type: 'link',
              active: false,
          selected: false,
            },
            {
              path: '/custompages/forgot-password',
              title: 'Forgot Password',
              dirchange: false,
              type: 'link',
              active: false,
          selected: false,
            },
            {
              path: '/custompages/reset-password',
              title: 'Reset Password',
              dirchange: false,
              type: 'link',
              active: false,
          selected: false,
            },
          
            {
              path: '/custompages/error404',
              title: '404 Error',
              dirchange: false,
              type: 'link',
              active: false,
          selected: false,
            },
          
          ],
        },
      ],
    },
   
  ];

  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
