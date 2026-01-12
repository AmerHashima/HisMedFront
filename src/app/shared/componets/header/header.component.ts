import {
  Component,
  OnInit,
  AfterViewInit,
  TemplateRef,
  ElementRef,
  Renderer2,
  inject,
  HostListener,
} from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { Menu, NavService } from '../../services/nav.service';
import { SidebarRightService } from '../../services/sidebar-right.service';
import { SwitcherService } from '../../services/switcher.service';
import { NgbOffcanvas, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FullscreenDirective } from '../../directives/fullscreen.directive';
import { CommonModule, NgClass } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';
import { SwitcherComponent } from '../switcher/switcher.component';
interface Item {
  id: number;
  name: string;
  type: string;
  title: string;
  // Add other properties as needed
}
@Component({
    selector: 'app-header',
    standalone:true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [RouterLink, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, FormsModule, NgbDropdownItem, FullscreenDirective, NgClass,CommonModule]
})
export class HeaderComponent implements OnInit {
    
  layoutSubscription: Subscription;
  public isCollapsed = true;
  themeType = 'dark';

  constructor(
    private sidebarRightservice: SidebarRightService,
    public navServices: NavService,private appStateService: AppStateService,
    public SwitcherService: SwitcherService, private router: Router,
    public el: ElementRef,private activatedRoute: ActivatedRoute, public modalService:NgbModal,
    public elementRef: ElementRef,
    public renderer: Renderer2
  ) {
    this.localStorageBackUp()
    this.layoutSubscription = sidebarRightservice.changeEmitted.subscribe(
      (direction) => {
        const dir = direction.direction;
      }
    );
    

    const windowObject: any = window;
    if (windowObject.innerWidth <= '991') {
      document.querySelector('html')?.setAttribute('data-toggled', 'close');
    } else {
      // document.querySelector('html')?.removeAttribute('data-toggled');
    }
  }
  localStorageBackUp() {
    let styleId = document.querySelector('#style');
  
    let html = document.querySelector('html');
    //Theme Color Mode:
    if (localStorage.getItem('valexHeader') == 'dark') {
      if (localStorage.getItem('valexdarktheme')) {
        const type: any = localStorage.getItem('valexdarktheme');
        html?.setAttribute('data-theme-mode', type);
        html?.setAttribute('data-header-styles', type);
        html?.setAttribute('data-menu-styles', type);
      }
      if (localStorage.getItem('valexdarktheme') == 'light') {
        const type: any = localStorage.getItem('valexdarktheme');
        html?.setAttribute('data-theme-mode', type);
        html?.setAttribute('data-header-styles', type);
        html?.setAttribute('data-menu-styles', type);
      }
    }
  }

   isFullscreen: boolean = false;

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }
  
  selectedItem: string  | null ='selectedItem'
  ngOnInit(): void {
    let navbarForm: any = document.querySelector('.navbar-form');
    if (navbarForm) {
      navbarForm.addEventListener(
        'click',
        (event: any) => {
          event.preventDefault();
          return;
        },
        { passive: false }
      );
    }
    const storedSelectedItem = localStorage.getItem('selectedItem');
    // this.updateSelectedItem();
  // If there's no selected item stored, set a default one
  if (!storedSelectedItem) {
    this.selectedItem = "Sales Dashboard"; // You can set any default item here
    localStorage.setItem('selectedItem', this.selectedItem);
  } else {
    this.selectedItem = storedSelectedItem;
  }
    this.navServices.items.subscribe((menuItems) => {
      this.items = menuItems;
    });
    // To clear and close the search field by clicking on body
    document.querySelector('.main-content')?.addEventListener('click', () => {
      this.clearSearch();
    });
    this.text = '';
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updateSelectedItem();
    });

  }

  private updateSelectedItem() {
    const dashboard = this.activatedRoute.snapshot.firstChild?.url[0]?.path;
    this.selectedItem = dashboard ? dashboard.charAt(0).toUpperCase() + dashboard.slice(1) + ' Dashboard' : this.selectedItem;
  }

  private offcanvasService = inject(NgbOffcanvas);
  toggleSwitcher() {
    this.offcanvasService.open(SwitcherComponent, {
      position: 'end',
      scroll: true,
    });
  }

  toggleSidebarNotification() {
    this.sidebarRightservice.emitSidebarNotifyChange(true);
  }
 
  togglesidebar() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (html?.getAttribute('data-toggled') == 'true') {
      document.querySelector('html')?.getAttribute('data-toggled') ==
        'icon-overlay-close';
    }
    else if (html?.getAttribute('data-nav-style') == 'menu-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-click-closed'
          ? ''
          : 'menu-click-closed'
      );
    } else if (html?.getAttribute('data-nav-style') == 'menu-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-hover-closed'
          ? ''
          : 'menu-hover-closed'
      );
    } else if (html?.getAttribute('data-nav-style') == 'icon-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-click-closed'
          ? ''
          : 'icon-click-closed'
      );
    } else if (html?.getAttribute('data-nav-style') == 'icon-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-hover-closed'
          ? ''
          : 'icon-hover-closed'
      );
    }
    else if (html?.getAttribute('data-vertical-style') == 'overlay') {
      html?.setAttribute(
        'data-vertical-style','overlay' 
      );
      html?.setAttribute(
        'data-toggled', html?.getAttribute('data-toggled') == 'icon-overlay-close'
        ? ''
        : 'icon-overlay-close'
      );
    } else if (html?.getAttribute('data-vertical-style')  == 'overlay') {
      document.querySelector('html')?.getAttribute('data-toggled') != null
        ? document.querySelector('html')?.removeAttribute('data-toggled')
        : document
            .querySelector('html')
            ?.setAttribute('data-toggled', 'icon-overlay-close');
    } else if (html?.getAttribute('data-vertical-style') == 'closed') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'close-menu-close'
          ? ''
          : 'close-menu-close'
      );
    } else if (html?.getAttribute('data-vertical-style') == 'icontext') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-text-close'
          ? ''
          : 'icon-text-close'
      );
    } else if (html?.getAttribute('data-vertical-style') == 'detached') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'detached-close'
          ? ''
          : 'detached-close'
      );
    }else if (html?.getAttribute('data-vertical-style') == 'doublemenu') {
      html?.setAttribute('data-toggled', html?.getAttribute('data-toggled') == 'double-menu-close' && document.querySelector(".slide.open")?.classList.contains("has-sub") && document.querySelector('.double-menu-active') ? 'double-menu-open': 'double-menu-close' );
    } 

    if (window.innerWidth <= 992) {
      // html?.setAttribute(
      //   'data-toggled',
      //   html?.getAttribute('data-toggled') == 'open' ? 'close' : 'open'
      // );
      // if (html?.getAttribute('data-toggled') == 'open') {
      //   document.querySelector('#responsive-overlay')?.classList.add('active');
      // }
    }
  }

   updateTheme(theme: string) {
    this.appStateService.updateState({ theme, menuColor: theme, headerColor: theme });
    if (theme == 'light') {
      this.appStateService.updateState({ theme, themeBackground: '', headerColor: 'light', menuColor: 'light' });
      let html = document.querySelector('html');
      html?.style.removeProperty('--body-bg-rgb');
      html?.style.removeProperty('--body-bg-rgb2');
      html?.style.removeProperty('--light-rgb');
      html?.style.removeProperty('--form-control-bg');
      html?.style.removeProperty('--input-border');
      html?.setAttribute('data-toggled', window.innerWidth <= 992 ? 'close' : '');
    }
    if (theme == 'dark') {
      this.appStateService.updateState({ theme, themeBackground: '', headerColor: 'dark', menuColor: 'dark' });
      let html = document.querySelector('html');
      html?.style.removeProperty('--body-bg-rgb');
      html?.style.removeProperty('--body-bg-rgb2');
      html?.style.removeProperty('--light-rgb');
      html?.style.removeProperty('--form-control-bg');
      html?.style.removeProperty('--input-border');
      html?.setAttribute('data-toggled', window.innerWidth <= 992 ? 'close' : '');
    }
  }

  ngOnDestroy(): void {
    const windowObject: any = window;
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (windowObject.innerWidth <= '991') {
      html?.setAttribute('data-toggled', 'open');
    }
    window.addEventListener('resize', () => {
      if (localStorage.getItem('valexverticalstyles') != 'icon-text-close') {
        if (windowObject.innerWidth <= '991') {
          html?.setAttribute('data-toggled', 'open');
        } else {
          if (!(localStorage.getItem('valexverticalstyles') == 'doublemenu')) {
            html?.removeAttribute('data-toggled');
          }
        }
      } else {
        document
          .querySelector('html')
          ?.setAttribute('data-toggled', 'icon-text-close');
      }
    });
  }

  // Addding sticky-pin
  scrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 10;
    const sections = document.querySelectorAll('.side-menu__item');
    const scrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;

    sections.forEach((ele, i) => {
      const currLink = sections[i];
      const val: any = currLink.getAttribute('value');
      const refElement: any = document.querySelector('#' + val);

      // Add a null check here before accessing properties of refElement
      if (refElement !== null) {
        const scrollTopMinus = scrollPos + 73;
        if (
          refElement.offsetTop <= scrollTopMinus &&
          refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
        ) {
          document.querySelector('.nav-scroll')?.classList.remove('active');
          currLink.classList.add('active');
        } else {
          currLink.classList.remove('active');
        }
      }
    });
  }

  // Search
  public menuItems!: Menu[];
  public items!: Menu[];
  public text!: string;
  public SearchResultEmpty: boolean = false;

  Search(searchText: string) {
    if (!searchText) return this.menuItems = [];
    // items array which stores the elements
    const items:Item[] = [];
    // Converting the text to lower case by using toLowerCase() and trim() used to remove the spaces from starting and ending
    searchText = searchText.toLowerCase().trim();
    this.items.filter((menuItems:Menu) => {
      // checking whether menuItems having title property, if there was no title property it will return
      if (!menuItems?.title) return false;
      //  checking wheteher menuitems type is text or string and checking the titles of menuitems
      if (menuItems.type === 'link' && menuItems.title.toLowerCase().includes(searchText)) {
        // Converting the menuitems title to lowercase and checking whether title is starting with same text of searchText
        if( menuItems.title.toLowerCase().startsWith(searchText)){ // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(menuItems))
          // If both are matching then the code is pushed to items array
          items.push(menuItems as Item);
        }
      }
      //  checking whether the menuItems having children property or not if there was no children the return
      if (!menuItems.children) return false;
      menuItems.children.filter((subItems:Menu) => {
        if (!subItems?.title) return false; 
        if (subItems.type === 'link' && subItems.title.toLowerCase().includes(searchText)) {
          if( subItems.title.toLowerCase().startsWith(searchText)){         // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subItems))
            items.push(subItems as Item);
          }

        }
        if (!subItems.children) return false;
        subItems.children.filter((subSubItems:Menu) => {
          if (subSubItems.title?.toLowerCase().includes(searchText)) {
            if( subSubItems.title.toLowerCase().startsWith(searchText)){ // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subSubItems))
              items.push(subSubItems as Item);
              
            }
          }
        });
        return true;
      });
      return this.menuItems = items;
    });
    // Used to show the No search result found box if the length of the items is 0
    if(!items.length){
      this.SearchResultEmpty = true;
    }
    else{
      this.SearchResultEmpty = false;
    }
    return true;
  }
  SearchModal(SearchModal: any) {
    this.modalService.open(SearchModal);
  }
  //  Used to clear previous search result
  clearSearch() {    
    const headerSearch = document.querySelector('.header-search');
    if (headerSearch) {
        headerSearch.classList.remove('searchdrop');
    }
    this.text = '';
    this.menuItems = [];
    this.SearchResultEmpty = false;
    return this.text, this.menuItems;
    
  }
  SearchHeader() {
    document
    .querySelector('.header-search')
    ?.classList.toggle('searchdrop');
  }
  isInputFocused: boolean = false;

  onInputFocus() {
    this.isInputFocused = true;
  }

  onInputBlur() {
    this.isInputFocused = false;
  }

}

