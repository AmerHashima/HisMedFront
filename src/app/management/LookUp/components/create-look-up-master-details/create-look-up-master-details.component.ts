import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LookUpDetailsFormComponent } from '../look-up-details-form/look-up-details-form.component';

@Component({
  selector: 'app-create-look-up-master-details',
  imports: [LookUpDetailsFormComponent],
  templateUrl: './create-look-up-master-details.component.html',
  styleUrl: './create-look-up-master-details.component.scss'
})
export class CreateLookUpMasterDetailsComponent {
  private router = inject(Router);
  onCancel() {
    this.router.navigateByUrl(`/looks-up`);
  }
}
