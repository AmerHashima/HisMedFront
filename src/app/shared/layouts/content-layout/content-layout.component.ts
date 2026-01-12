import { Component, OnInit } from '@angular/core';
// import { localStorageBackUp } from '../../componets/switcher/switcher';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from '../../componets/loader/loader.component';

@Component({
    selector: 'app-content-layout',
    standalone:true,
    templateUrl: './content-layout.component.html',
    styleUrls: ['./content-layout.component.scss'],
    imports: [RouterOutlet, LoaderComponent]
})
export class ContentLayoutComponent implements OnInit {
  
  constructor() {
  //  localStorageBackUp()
    if(sessionStorage.getItem('DarkTheme') !== null){
      document.querySelector('body')?.classList.add('dark-theme');
      document.querySelector('body')?.classList.remove('light-theme');
      document.querySelector('body')?.classList.remove('transparent-theme');
    }
    if (sessionStorage.getItem('TransparentTheme') !== null ) {
      document.querySelector('body')?.classList.add('transparent-theme');
      document.querySelector('body')?.classList.remove('light-theme');
      document.querySelector('body')?.classList.remove('dark-theme');
    }
    if (sessionStorage.getItem('BgImage') !== null) {
      document.querySelector('body')?.classList.add('bg-img1');
    }
   }

  ngOnInit(): void {
    document.body.classList.add('error-3', 'error-page1');
    document.body.classList.remove('horizontal');
  }


  ngOnDestroy(): void {
    document.body.classList.remove('error-3', 'error-page1');
  }
 
}
