import { Component, ElementRef, HostListener, inject, OnInit, Renderer2 } from '@angular/core';
import { SwitcherService } from 'src/app/shared/services/switcher.service';
import { Menu, NavService } from '../../services/nav.service';
// import { localStorageBackUp } from '../../componets/switcher/switcher';
import { LoaderComponent } from '../../componets/loader/loader.component';
import { HeaderComponent } from '../../componets/header/header.component';
import { NotificationSidebarComponent } from '../../componets/notification-sidebar/notification-sidebar.component';
import { SidemenuComponent } from '../../componets/sidemenu/sidemenu.component';
import { HoverEffectSidebarDirective } from '../../directives/hover-effect-sidebar.directive';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../componets/footer/footer.component';
import { TapToTopComponent } from '../../componets/tap-to-top/tap-to-top.component';
import { NgbOffcanvas, NgbOffcanvasModule, NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';import { filter, Subscription } from 'rxjs';
@Component({
    selector: 'app-full-layout',
    standalone:true,
    templateUrl: './full-layout.component.html',
    styleUrls: ['./full-layout.component.scss'],
    imports: [ LoaderComponent, NgbOffcanvasModule,HeaderComponent, NotificationSidebarComponent, SidemenuComponent, HoverEffectSidebarDirective, RouterOutlet, FooterComponent, TapToTopComponent],
    providers:[NgbActiveOffcanvas]
})
export class FullLayoutComponent implements OnInit {
  menuItems!:Menu[];
  menuitemsSubscribe$!:Subscription
  constructor(
    private navServices: NavService,  private router:Router,
    private elementRef: ElementRef,private renderer:Renderer2
  ) {
    const htmlElement =
    this.elementRef.nativeElement.ownerDocument.documentElement;
    let html = document.querySelector('html');

    if (window.innerWidth <= 992) {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'close' ? 'close' : 'close'
      );
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      window.scrollTo(0, 0);
    });
  }
  
  ngOnInit() {

    this.menuitemsSubscribe$ = this.navServices.items.subscribe((items: any) => {
      this.menuItems = items;
    });
  
  }

  clearNavDropdown() {
    this.menuItems?.forEach((a: any) => {
      a.active = false;
      a?.children?.forEach((b: any) => {
        b.active = false;
        b?.children?.forEach((c: any) => {
          c.active = false;
        });
      });
    });
  }
  clickOnBody() {
    document.querySelector('#responsive-overlay')?.classList.remove('active');
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (window.innerWidth <= 992) {
      html?.setAttribute('data-toggled', html?.getAttribute('data-toggled') == 'close' ? 'close' : 'close');
    }
    html?.removeAttribute('data-icon-text');


    this.menuItem.active = !this.menuItem.active;

    if(html.getAttribute('data-nav-layout') =='horizontal' && window.innerWidth >= 992){this.clearNavDropdown();}
    const navStyle = document.documentElement.getAttribute('data-nav-style');
    if (navStyle === 'menu-click' || navStyle === 'menu-hover' || navStyle === 'icon-click' || navStyle === 'icon-hover') {
      document.querySelector('.double-menu-active')?.setAttribute('style', 'display: none;');
    }   
  }
  menuItem = {
    active: false,
  };


  clearToggle() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    html?.setAttribute('data-toggled', 'close');
    document.querySelector('#responsive-overlay')?.classList.add('active');
  }
}
