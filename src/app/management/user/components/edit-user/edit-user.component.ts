import { Component } from '@angular/core';

import { UserFormComponent } from '../user-form/user-form.component';
@Component({
  selector: 'app-edit-user',
    imports: [ UserFormComponent],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {

}
