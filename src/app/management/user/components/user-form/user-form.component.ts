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
import { RoleService } from 'src/app/common/service/role.service';
import { ValidationErrorService } from 'src/app/common/service/validation-error.service';
import { SharedService } from '../../../../shared/services/shared.service';
@Component({
  selector: 'app-user-form',
  imports: [SpkNgSelectComponent, ButtonComponent, InputComponent, ToggleBtnComponent,
    SpkFlatpickrComponent, ReactiveFormsModule,AsyncPipe],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  private lookupService=inject(LookupService);
  private roleService = inject(RoleService);
  private sharedService = inject(SharedService);

  @Output() cancalEvent = new EventEmitter<any>();
  oid = input<string>('');
  genderOptions$ = this.lookupService.getGender();

  roleOptions$ = this.roleService.getRoles();
  fb = inject(FormBuilder);
  store = inject(UsersStore);
  id: string = '';
  validationErrorService = inject(ValidationErrorService);

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
    genderLookupId: ['', Validators.required],
    birthDate: ['', [Validators.required, notInFutureValidator()]],
    roleId: [0, Validators.required],
  });

  private backendErrorKeyMap: Record<string, string[]> = {
    username: ['username', 'user name'],
    email: ['email', 'e-mail'],
    phone: ['phone', 'mobile'],
  };
  apiFieldErrors: Record<string, string> = {};

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
          genderLookupId: user.genderLookupId ? user.genderLookupId : null,
          roleId: user.roleId,
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

      if (!error) {
        this.validationErrorService.clearErrors(this.form, this.apiFieldErrors);
      } else {
        this.validationErrorService.handleApiErrors(
          this.form,
          error,
          this.backendErrorKeyMap,
          this.apiFieldErrors
        );
      }
    });

    effect(() => {
      const success = this.store.success();
      if (success)
        this.cancel();
        this.store.setSuccess(false);
    });

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
    const birthday = this.sharedService.formatDateOnly(v.birthDate!)
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
      genderLookupId: v.genderLookupId!,
      roleId: v.roleId!,
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
