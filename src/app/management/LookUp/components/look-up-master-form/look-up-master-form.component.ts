import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LookupService } from 'src/app/common/service/lookup.service';
import { LOOKUPStore } from '../../store/lookup.store';
import { LookUPMaster } from '../../models/lookup';
import { InputComponent } from 'src/app/common/input/input.component';
import { ToggleBtnComponent } from 'src/app/common/toggle-btn/toggle-btn.component';
import { ButtonComponent } from 'src/app/common/button/button.component';

@Component({
  selector: 'app-look-up-master-form',
  imports: [InputComponent,ToggleBtnComponent,ButtonComponent,ReactiveFormsModule],
  templateUrl: './look-up-master-form.component.html',
  styleUrl: './look-up-master-form.component.scss',
})
export class LookUpMasterFormComponent {
  private store = inject(LOOKUPStore);
  @Output() cancalEvent = new EventEmitter<any>();
  // oid = input<string>('');

  fb = inject(FormBuilder);
  // id: string = '';

  form = this.fb.group({
    lookupCode: ['', [Validators.required]],
    lookupNameAr: ['', [Validators.required]],
    lookupNameEn: ['', [Validators.required]],
    description: ['', [Validators.required]],
    isSystem: [false],
  });

  private backendErrorKeyMap: Record<string, string[]> = {
    lookupCode: ['lookupCode'],
    lookupNameAr: ['lookupNameAr'],
    lookupNameEn: ['lookupNameEn'],
  };
  constructor() {

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
      console.log('success',success);
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


  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.valid ) {
      this.createLookupMaster();
    }
  }
  createLookupMaster() {
    this.store.addLookUpMaster(this.getPayload());
  }


  getPayload() {
    const v = this.form.getRawValue();
    const payload: LookUPMaster = {
      lookupCode: v.lookupCode!,
      lookupNameAr: v.lookupNameAr!,
      lookupNameEn: v.lookupNameEn!,
      description: v.description!,
      isSystem: v.isSystem ?? true,
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
