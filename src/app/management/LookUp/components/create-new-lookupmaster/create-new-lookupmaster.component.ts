import { Component, inject } from '@angular/core';
import { LookUpMasterFormComponent } from '../look-up-master-form/look-up-master-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-new-lookupmaster',
  imports: [LookUpMasterFormComponent],
  templateUrl: './create-new-lookupmaster.component.html',
  styleUrl: './create-new-lookupmaster.component.scss'
})
export class CreateNewLookupmasterComponent {
  private router=inject(Router);
  onCancel(){
     this.router.navigateByUrl(`/looks-up`);
  }
}
