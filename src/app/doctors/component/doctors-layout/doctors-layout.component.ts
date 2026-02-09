import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DoctorStore } from '../../doctorStore/doctorStore';

@Component({
  selector: 'app-doctors-layout',
  imports: [RouterOutlet],
  templateUrl: './doctors-layout.component.html',
  styleUrl: './doctors-layout.component.scss',
  providers: [DoctorStore]

})
export class DoctorsLayoutComponent {

}
