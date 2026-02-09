import { Component } from '@angular/core';
import { PatientFormComponent } from '../patient-form/patient-form.component';

@Component({
  selector: 'app-create-patient',
  imports: [PatientFormComponent],
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.scss'
})
export class CreatePatientComponent {

}
