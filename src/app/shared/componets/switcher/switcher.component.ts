import {
  Component,
  ElementRef,
  inject,
  Renderer2,
} from '@angular/core';
import { NavService } from '../../services/nav.service';
import { SwitcherService } from '../../services/switcher.service';
import { NgbNav, NgbNavItem, NgbNavLinkButton, NgbNavLinkBase, 
  NgbNavContent, NgbNavOutlet, NgbActiveOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-switcher',
  standalone:true,
    templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss'],
  imports: [NgbNav, NgbNavItem, NgbOffcanvasModule,NgbNavLinkButton, NgbNavLinkBase, NgbNavContent, ColorPickerModule, NgbNavOutlet],

})
export class SwitcherComponent {
  activeOffcanvas = inject(NgbActiveOffcanvas);
  active = 1;
  public localdata: any ;
  constructor(
    public renderer: Renderer2,
    public switcherServic: SwitcherService,
    public navServices: NavService,
    private elementRef: ElementRef,
    private appStateService: AppStateService,
  ) {
    this.appStateService.state$.subscribe(state => {
      this.localdata = state;
    });
    }

  // Theme color Mode
  updateTheme(theme: string) {
    this.appStateService.updateState({ theme, menuColor: theme, headerColor: theme });
    if (theme == 'light') {
      this.appStateService.updateState({ theme, themeBackground: '', headerColor: 'light', menuColor: 'light' });
      let html = document.querySelector('html');
      html?.style.removeProperty('--body-bg-rgb');
      html?.style.removeProperty('--body-bg-rgb2');
      html?.style.removeProperty('--light-rgb');
      html?.style.removeProperty('--gray-3');
      html?.style.removeProperty('--form-control-bg');
      html?.style.removeProperty('--input-border');
    }
    if (theme == 'dark') {
      this.appStateService.updateState({ theme, themeBackground: '', headerColor: 'dark', menuColor: 'dark' });
      let html = document.querySelector('html');
      html?.style.removeProperty('--body-bg-rgb');
      html?.style.removeProperty('--body-bg-rgb2');
      html?.style.removeProperty('--light-rgb');
      html?.style.removeProperty('--gray-3');
      html?.style.removeProperty('--form-control-bg');
      html?.style.removeProperty('--input-border');
    }
  }
  //  Directions
   updateDirection(direction: string) {
    this.appStateService.updateState({ direction });
  }

  //Navigation Styles:
  updatemenuType(navigationStyles: string) {
    this.appStateService.updateState({ navigationStyles });
    const currentMenuStyles = this.appStateService.getState('menuStyles') || '';

    if (navigationStyles == 'horizontal') {
      // Set default 'menu-click' if nothing else is set
      // const defaultMenuStyle = currentMenuStyles || '';
      this.appStateService.updateState({ navigationStyles,menuStyles:'menu-click', layoutStyles: '' });
      this.checkMenuElement(currentMenuStyles);  // Use the default style
      const navStyle = document.documentElement.getAttribute('data-nav-style');
  
      if(navStyle === 'menu-click'){
      const Sidebar: any = document.querySelector(".main-menu");
      if (Sidebar) {
          Sidebar.style.marginInline = "0px";
      }
    }
      setTimeout(() => {
        const mainContentElement = document.querySelector(".main-content") as HTMLElement | null;
        if (mainContentElement) {
            mainContentElement.click();
        }
      }, 100);
    } else if(navigationStyles == 'vertical'){
      this.appStateService.updateState({ navigationStyles, menuStyles: '', layoutStyles: 'default' });
    }
}
private checkMenuElement(menuStyles: string) {
  // Define element IDs based on menuStyles
  const elementIds: { [key: string]: string } = {
    'menu-click': 'switcher-menu-click',
    'menu-hover': 'switcher-menu-hover',
    'icon-hover': 'switcher-icon-hover',
    'icon-click': 'switcher-icon-click',

  };

  // Get the corresponding element ID
  const elementId = elementIds[menuStyles];

  if (elementId) {
    const menuElement = document.getElementById(elementId) as HTMLInputElement;
    if (menuElement) {
      menuElement.checked = true;
    }
    else{
          const menuclickclosed = document.getElementById(
        'switcher-menu-click'
      ) as HTMLInputElement;
      menuclickclosed.checked = true;
    }
  }
}
  //Vertical & Horizontal Menu Styles:
  updatemenuStyle(menuStyles: string) {
    this.appStateService.updateState({ menuStyles, layoutStyles: '' });


    const navStyle = document.documentElement.getAttribute('data-nav-style');
  
    if(navStyle === 'icon-hover'){
      document.querySelector('.double-menu-active')?.setAttribute('style', 'display: none;');
      const Sidebar: any = document.querySelector(".main-menu");
      if (Sidebar) {
          Sidebar.style.marginInline = "0px";
      }
    }
  
    if(navStyle === 'icon-click'){
      const Sidebar: any = document.querySelector(".main-menu");
      if (Sidebar) {
          Sidebar.style.marginInline = "0px";
      }
    }
  }

  //Sidemenu Layout Styles:
  updatelayoutStyles(layoutStyles: string) {
    this.appStateService.updateState({ layoutStyles, menuStyles: '',navigationStyles:'' });
    if (document.querySelector('html')?.getAttribute('data-vertical-style') == 'doublemenu') {
      document.querySelector('.slide-menu')?.classList.add('double-menu-active');
       }
       else{
        document.querySelector('.slide-menu')?.classList.remove('double-menu-active');
       }
  }

  setAttr(key: string, value: string): void {
    const htmlElement = this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, key, value);
    return;
  }
  removeAttr(key: string): void {
    const htmlElement = this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.removeAttribute(htmlElement, key);
    return;
  }

  //Page Styles:
  updatepageStyles(pageStyles: string) {
    this.appStateService.updateState({ pageStyles });
  }

  //Layout Width Styles:
  updatewidthStyles(widthStyles: string) {
    this.appStateService.updateState({ widthStyles });
  }

  //Menu Positions:
  updatemenuPosition(menuPosition: string) {
    this.appStateService.updateState({ menuPosition });
  }

  //Header Positions:
  updateheaderPosition(headerPosition: string) {
    this.appStateService.updateState({ headerPosition });
  }

  updatemenuColor(menuColor: string) {
    this.appStateService.updateState({ menuColor });
  }
 
  //header theme
  updateheaderColor(headerColor: string) {
    this.appStateService.updateState({ headerColor: headerColor });
  }

  //Theme Primary
  updateprimary(themePrimary: string) {
    this.appStateService.updateState({ themePrimary });
  }
  updateBackground(themeBackground: any) {
    this.appStateService.updateState({ themeBackground, menuColor: 'dark',   headerColor: 'dark',theme:"dark" });
  }
  updateBgImage(backgroundImage: string) {
    this.appStateService.updateState({ backgroundImage, });
  }

  
  defaultPrimary = '#6c5ffc';
  public dynamicLightPrimary(data: any): void {
    this.defaultPrimary = data.color;
    let primaryColor = this.convertRgbToIndividual1(this.defaultPrimary)

    this.updateprimary(primaryColor);

  }
  convertRgbToIndividual1(value: string): string {
    // Use a regular expression to extract the numeric values
    const numericValues = value.match(/\d+/g) || [];
    // Join the numeric values with spaces to get the desired format
    return numericValues.join(' , ');
  }
  //background theme change
  convertRgbToIndividual(value: string): string {
    // Use a regular expression to extract the numeric values
    const numericValues = value.match(/\d+/g) || [];
    // Join the numeric values with spaces to get the desired format
    return numericValues.join(' ');
  }


  public defaultBg = '#6c5ffc';
  public dynamicTranparentBgPrimary(data: any): void {
    this.defaultBg = data.color;
    let bgRgb = this.convertRgbToIndividual(this.defaultBg);
    let bgRgb2 = this.convertRgbToIndividual(this.defaultBg);
    let bg1Update = bgRgb.split(' ').join(', ');
    let bg2Update: any = bgRgb2.split(' ');
    bg2Update[0] = Number(bg2Update[0]) + 14;
    bg2Update[1] = Number(bg2Update[1]) + 14;
    bg2Update[2] = Number(bg2Update[2]) + 14;
    let bgColor = { main: bg1Update, secondary: bg2Update.join(', '),
      accent: bg2Update.join(', '), overlay: 'rgba(255,255,255,0.1)',
      theme: 'dark',
    }
    this.updateBackground(bgColor);
  }
  
  reset() {
    this.appStateService.applyReset();
  }

  
}
