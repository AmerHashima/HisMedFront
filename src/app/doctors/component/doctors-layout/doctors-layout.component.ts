import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DoctorStore } from '../../doctorStore/doctorStore';
import { BranchStore } from 'src/app/Hospital/Store/Branch/branch.store';
import { SpecialityStore } from 'src/app/Hospital/Store/Speciality/speciality.store';

@Component({
  selector: 'app-doctors-layout',
  imports: [RouterOutlet],
  templateUrl: './doctors-layout.component.html',
  styleUrl: './doctors-layout.component.scss',
  providers: [DoctorStore, BranchStore, SpecialityStore]

})
export class DoctorsLayoutComponent {

}
