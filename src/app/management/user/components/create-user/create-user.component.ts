import { Component } from '@angular/core';
import { UserFormComponent } from '../user-form/user-form.component';
@Component({
  selector: 'app-create-user',
  imports: [UserFormComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
}
