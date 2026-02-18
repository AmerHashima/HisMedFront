import { Component, computed, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { InputComponent } from 'src/app/common/input/input.component';
import { ToggleBtnComponent } from 'src/app/common/toggle-btn/toggle-btn.component';
import { Branch } from 'src/app/Hospital/models/branch';
import { BranchStore } from 'src/app/Hospital/Store/Branch/branch.store';

@Component({
  selector: 'app-branch-form',
  imports: [InputComponent,ReactiveFormsModule,ToggleBtnComponent,ButtonComponent],
  templateUrl: './branch-form.component.html',
  styleUrl: './branch-form.component.scss'
})
export class BranchFormComponent {
  @Output() cancalEvent = new EventEmitter<any>();
  oid = input<string>('');
  fb = inject(FormBuilder);
  store = inject(BranchStore);
  // specialities = computed(() => this.store.specialities());
  branches = computed(() => this.store.items());
  form = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    country: ['', Validators.required],
    postalCode: ['', Validators.required],
    isActive: [false, Validators.required],
  });

  private backendErrorKeyMap: Record<string, string[]> = {
    code: ['code'],
    name: ['name'],
    address: ['address'],
    city: ['city'],
    country: ['country'],
    postalCode: ['postalCode'],
    state: ['state'],

  };
  constructor() {

    effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.form.reset();
        return;
      }
      this.store.getBranch(oid);
    });

    effect(() => {
      // const speciality = this.store.selectedSpeciality();
      const branch = this.store.selectedItem();
      if (branch) {
        this.form.patchValue({
          code: branch.code,
          name: branch.name,
          state: branch.state,
          country: branch.country,
          city: branch.city,
          postalCode: branch.postalCode,
          address: branch.address,
          isActive: branch.isActive,
        });
      }
    });


    effect(() => {
      const error = this.store.error();
      if (!error) {
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
    this.apiFieldErrors = {};

    // clear form-level errors
    this.form.setErrors(null);

    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      if (!control) return;

      control.setErrors(null);

      control.markAsUntouched();
      control.markAsPristine();
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.valid && !this.oid()) {
      this.createBranch();
    }
    if (this.form.valid && this.oid()) {
      this.editBranch();
    }
  }
  createBranch() {
    this.store.addBranch(this.getPayload());
  }
  editBranch() {
    this.store.updateBranch({ id: this.oid(), body: this.getPayload() });

  }

  getPayload() {
    const v = this.form.getRawValue();
    const payload: Branch = {
      ...(this.oid() ? { oid: this.oid() } : {}),
      code: v.code!,
      name: v.name!,
      address: v.address!,
      city: v.city!,
      state: v.state!,
      country: v.country!,
      postalCode: v.postalCode!,
      isActive: v.isActive ?? true,
    };
    return payload;
  }
  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.cancalEvent.emit();
  }
  back() {
    this.cancalEvent.emit();
  }
}
