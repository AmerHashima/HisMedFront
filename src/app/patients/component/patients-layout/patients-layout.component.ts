import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientStore } from '../../patientStore/patient.store';

@Component({
  selector: 'app-patients-layout',
  imports: [RouterOutlet],
  templateUrl: './patients-layout.component.html',
  styleUrl: './patients-layout.component.scss',
  providers:[PatientStore]
})
export class PatientsLayoutComponent {

}
