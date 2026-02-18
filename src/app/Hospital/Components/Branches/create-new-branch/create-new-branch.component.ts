import { Component } from '@angular/core';
import { BranchFormComponent } from '../branch-form/branch-form.component';

@Component({
  selector: 'app-create-new-branch',
  imports: [BranchFormComponent],
  templateUrl: './create-new-branch.component.html',
  styleUrl: './create-new-branch.component.scss'
})
export class CreateNewBranchComponent {

}
