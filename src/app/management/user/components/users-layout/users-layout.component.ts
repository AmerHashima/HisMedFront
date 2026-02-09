import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersStore } from '../../userStore/userStore';

@Component({
  selector: 'app-users-layout',
  imports: [RouterOutlet],
  templateUrl: './users-layout.component.html',
  styleUrl: './users-layout.component.scss',
  providers: [UsersStore],

})
export class UsersLayoutComponent {

}
