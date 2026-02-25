import { Component, inject } from '@angular/core';
import { BranchFormComponent } from '../branch-form/branch-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-new-branch',
  imports: [BranchFormComponent],
  templateUrl: './create-new-branch.component.html',
  styleUrl: './create-new-branch.component.scss'
})
export class CreateNewBranchComponent {
  private router = inject(Router);
  onCancel() {
    this.router.navigateByUrl(`hospital/branches`);
  }
}
