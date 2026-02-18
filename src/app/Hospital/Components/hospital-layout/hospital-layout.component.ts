import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpecialityStore } from '../../Store/Speciality/speciality.store';
import { AppointmentStore } from '../../Store/Appointment/appointment.store';
import { BranchStore } from '../../Store/Branch/branch.store';

@Component({
  selector: 'app-hospital-layout',
  imports: [RouterOutlet],
  templateUrl: './hospital-layout.component.html',
  styleUrl: './hospital-layout.component.scss',
  providers:[SpecialityStore,AppointmentStore,BranchStore]
})
export class HospitalLayoutComponent {

}
