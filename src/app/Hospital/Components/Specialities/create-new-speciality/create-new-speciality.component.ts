import { Component, inject } from '@angular/core';
import { SpecialityFormComponent } from '../speciality-form/speciality-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-new-speciality',
  imports: [SpecialityFormComponent],
  templateUrl: './create-new-speciality.component.html',
  styleUrl: './create-new-speciality.component.scss'
})
export class CreateNewSpecialityComponent {
  private router = inject(Router);
  onCancel() {
    this.router.navigateByUrl(`hospital/specialities`);
  }
}
