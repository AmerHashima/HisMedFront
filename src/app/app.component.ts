import { Component } from '@angular/core';
import { fromEvent } from 'rxjs';
import { SharedModule } from './shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { AppStateService } from './shared/services/app-state.service';

@Component({
    selector: 'app-root',
    standalone:true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports:[SharedModule,RouterOutlet]
})

export class AppComponent {
  title = 'valex';
  public isSpinner = true;
  
  constructor(private appState : AppStateService){
    this.appState.updateState();
  }

  ngOnInit() {
    // this.isSpinner = false
    fromEvent(window, 'load').subscribe(() => {document.querySelector('#glb-loader')?.classList.remove('loaderShow');});
  }
}
