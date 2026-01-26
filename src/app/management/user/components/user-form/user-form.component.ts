import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersStore } from '../../userStore/userStore';
import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { InputComponent } from 'src/app/common/input/input.component';
import { ToggleBtnComponent } from 'src/app/common/toggle-btn/toggle-btn.component';
import SpkFlatpickrComponent from 'src/app/common/spk-flatpickr/spk-flatpickr.component';
import { User } from '../../models/user';
@Component({
  selector: 'app-user-form',
  imports: [SpkNgSelectComponent, ButtonComponent, InputComponent, ToggleBtnComponent, SpkFlatpickrComponent, ReactiveFormsModule],
  providers: [UsersStore],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  @Output() cancalEvent=new EventEmitter<any>();
  oid=input<string>('');
  genderOptions = [
    { label: "Female", value: "f" },
    { label: "Male", value: "m" }
  ]
  roleOptions = [
    { label: "Admin", value: 0 },
    { label: "Client", value: 1 }
  ]
  fb = inject(FormBuilder);
  store = inject(UsersStore);
  id:string='';

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    middleName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    twoFactorEnabled: [false],
    isActive: [false],
    gender: ['', Validators.required],
    birthDate: ['', Validators.required],
    roleID: [0, Validators.required],
  });

  constructor() {

    effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.form.reset();
        return;
      }
      this.store.getUser(oid);
    });

    effect(() => {
      const user = this.store.selectedUser();
      if (user) {
        this.form.patchValue({
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          twoFactorEnabled: user.twoFactorEnabled,
          isActive: user.isActive,
          gender: user.gender ? user.gender.toLowerCase() : null,
          roleID: user.roleID,
          birthDate: user.birthDate,
        });
      }
    });
  }



 formatDateOnly(value: string | Date): string {
  const d = new Date(value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.valid && !this.oid()) {
      this.createUser();
    }
    if (this.form.valid && this.oid()) {
      this.editUser();
    }
  }
  createUser(){
    this.store.addUser(this.getPayload());
  }
  editUser() {
    this.store.updateUser({id:this.oid(),body:this.getPayload()});
  }

  getPayload(){
    const v = this.form.getRawValue();
    const birthday = this.formatDateOnly(v.birthDate!)
    const payload: User = {
      ...(this.oid() ? { oid: this.oid() } : {}),
      username: v.username!,
      email: v.email!,
      mobile: v.mobile!,
      password: v.password!,
      firstName: v.firstName!,
      middleName: v.middleName!,
      lastName: v.lastName!,
      twoFactorEnabled: v.twoFactorEnabled ?? false,
      isActive: v.isActive ?? true,
      gender: v.gender!,
      roleID: v.roleID!,
      birthDate: birthday
    };
    return payload;
  }
  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.cancalEvent.emit();
    // this.router.navigateByUrl("/users");
  }
  back(){
    this.cancalEvent.emit();

    // this.router.navigateByUrl("/users");
  }
}
