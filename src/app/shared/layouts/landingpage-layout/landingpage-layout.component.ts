import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from '../../componets/loader/loader.component';

@Component({
    selector: 'app-landingpage-layout',
    standalone:true,
    templateUrl: './landingpage-layout.component.html',
    styleUrls: ['./landingpage-layout.component.scss'],
    imports: [RouterOutlet, LoaderComponent]
})
export class LandingpageLayoutComponent {

  constructor( ) {
     document.body.classList.add('landing-body');
     document.body.classList.remove('main-body');
  }
}
