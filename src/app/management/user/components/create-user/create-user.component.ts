import { Component, inject } from '@angular/core';
import { UserFormComponent } from '../user-form/user-form.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-user',
  imports: [UserFormComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  private router = inject(Router);
  onCancel() {
    this.router.navigateByUrl(`users`);
  }
}
