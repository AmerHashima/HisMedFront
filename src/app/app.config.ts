import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {routes} from "./app.routes"
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FlatpickrDefaults } from 'angularx-flatpickr';
import { ColorPickerModule } from 'ngx-color-picker';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    FlatpickrDefaults,
    importProvidersFrom(
      BrowserAnimationsModule,
      ColorPickerModule,
      AngularFireModule.initializeApp(environment.firebase),
    ToastrModule.forRoot({
      timeOut: 15000, // 15 seconds
      closeButton: true,  
      progressBar: true,
    }),
    )
    ]
    
};

