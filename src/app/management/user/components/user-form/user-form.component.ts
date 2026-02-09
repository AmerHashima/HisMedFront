import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersStore } from '../../userStore/userStore';
import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { InputComponent } from 'src/app/common/input/input.component';
import { ToggleBtnComponent } from 'src/app/common/toggle-btn/toggle-btn.component';
import SpkFlatpickrComponent from 'src/app/common/spk-flatpickr/spk-flatpickr.component';
import { User } from '../../models/user';
import { passwordStrengthValidator } from 'src/app/common/validators/passwordStrengthValidator';
import { notInFutureValidator } from 'src/app/common/validators/notInFutureValidator';
import { LookupService } from 'src/app/common/service/lookup.service';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-user-form',
  imports: [SpkNgSelectComponent, ButtonComponent, InputComponent, ToggleBtnComponent,
    SpkFlatpickrComponent, ReactiveFormsModule,AsyncPipe],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  private lookupService=inject(LookupService);
  @Output() cancalEvent = new EventEmitter<any>();
  oid = input<string>('');
  genderOptions$ = this.lookupService.getGender();

  roleOptions = [
    { label: "Admin", value: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
  ]
  fb = inject(FormBuilder);
  store = inject(UsersStore);
  id: string = '';

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required]],
    password: [''],
    firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    middleName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    twoFactorEnabled: [false],
    isActive: [false],
    gender: ['', Validators.required],
    birthDate: ['', [Validators.required, notInFutureValidator()]],
    roleID: [0, Validators.required],
  });

  private backendErrorKeyMap: Record<string, string[]> = {
    username: ['username', 'user name'],
    email: ['email', 'e-mail'],
    phone: ['phone', 'mobile'],
  };
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


    effect(() => {
      const isEdit = !!this.oid();

      const passwordCtrl = this.form.get('password');
      if (!passwordCtrl) return;

      if (isEdit) {
        passwordCtrl.clearValidators();
        passwordCtrl.reset();
      } else {
        passwordCtrl.setValidators([
          Validators.required,
          Validators.minLength(8),
          passwordStrengthValidator()
        ]);
      }

      passwordCtrl.updateValueAndValidity();
    });

    effect(() => {
      const error = this.store.error();

      if (!error ) {
        this.clearAllFieldErrors();
      } else {
        this.getApiErrorMessage(error);
      }
    });

    effect(() => {
      const success = this.store.success();
      if (success)
        this.cancel();
        this.store.setSuccess(false);
    });

  }

  apiFieldErrors: Record<string, string> = {};

  getApiErrorMessage(error: string) {
    this.apiFieldErrors = {};
    if (!error) return;

    const message = error.toLowerCase();

    for (const field in this.backendErrorKeyMap) {
      const keywords = this.backendErrorKeyMap[field];

      if (keywords.some(k => message.includes(k))) {
        this.applyBackendErrorToControl(field, error);
        return;
      }
    }

    this.form.setErrors({ backendError: true });
  }

  applyBackendErrorToControl(field: string, message: string) {
    const control = this.form.get(field);
    if (!control) return;

    this.apiFieldErrors[field] = message;

    control.setErrors({
      ...(control.errors ?? {}),
      backendError: true
    });

    control.markAsTouched();
  }
  private clearAllFieldErrors() {
    // clear all backend API errors
    this.apiFieldErrors = {};

    // clear form-level errors
    this.form.setErrors(null);

    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      if (!control) return;

      // remove ALL errors (required, minlength, backendError, etc.)
      control.setErrors(null);

      // reset state flags
      control.markAsUntouched();
      control.markAsPristine();
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
  createUser() {
    this.store.addUser(this.getPayload());
  }
  editUser() {
    console.log('in edit');
    this.store.updateUser({ id: this.oid(), body: this.getPayload() });

  }

  getPayload() {
    const v = this.form.getRawValue();
    const birthday = this.formatDateOnly(v.birthDate!)
    const payload: User = {
      ...(this.oid() ? { oid: this.oid() } : {}),
      username: v.username!,
      email: v.email!,
      mobile: v.mobile!,
      // password: v.password!,
      ...(this.oid() ? {} : { password: v.password! }),
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
  back() {
    this.cancalEvent.emit();

    // this.router.navigateByUrl("/users");
  }
}
