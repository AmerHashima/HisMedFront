import { Component, inject } from '@angular/core';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-patient',
  imports: [PatientFormComponent],
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.scss'
})
export class CreatePatientComponent {
  private router = inject(Router);
  onCancel() {
    this.router.navigateByUrl(`patients`);
  }
}
