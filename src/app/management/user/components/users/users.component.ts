import { Component, inject } from '@angular/core';
import { UsersStore } from '../../userStore/userStore';
import { JsonPipe, AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-users',
  imports: [JsonPipe, AsyncPipe],
  providers: [UsersStore],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  userStore = inject(UsersStore);
 users$=this.userStore.loadUsers();
}
