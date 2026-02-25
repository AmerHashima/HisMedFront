import { Component, inject } from '@angular/core';
import { AppotntmentFormComponent } from '../appotntment-form/appotntment-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-new-appointment',
  imports: [AppotntmentFormComponent],
  templateUrl: './create-new-appointment.component.html',
  styleUrl: './create-new-appointment.component.scss'
})
export class CreateNewAppointmentComponent {
  private router = inject(Router);
  onCancel() {
    this.router.navigateByUrl(`hospital/appointments`);
  }
}
