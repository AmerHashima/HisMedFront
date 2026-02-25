import { Component, inject } from '@angular/core';
import { DoctorFormComponent } from '../doctor-form/doctor-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-doctor',
  imports: [DoctorFormComponent],
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.scss'
})
export class CreateDoctorComponent {
  private router = inject(Router);
  onCancel() {
    this.router.navigateByUrl(`doctors`);
  }
}
