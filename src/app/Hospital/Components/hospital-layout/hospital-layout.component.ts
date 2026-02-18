import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpecialityStore } from '../../Store/Speciality/speciality.store';

@Component({
  selector: 'app-hospital-layout',
  imports: [RouterOutlet],
  templateUrl: './hospital-layout.component.html',
  styleUrl: './hospital-layout.component.scss',
  providers:[SpecialityStore]
})
export class HospitalLayoutComponent {

}
