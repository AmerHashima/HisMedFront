import { Component } from '@angular/core';
import { DoctorFormComponent } from '../doctor-form/doctor-form.component';

@Component({
  selector: 'app-create-doctor',
  imports: [DoctorFormComponent],
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.scss'
})
export class CreateDoctorComponent {

}
