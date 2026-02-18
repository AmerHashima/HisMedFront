import { Component, computed, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { InputComponent } from 'src/app/common/input/input.component';
import { ToggleBtnComponent } from 'src/app/common/toggle-btn/toggle-btn.component';
import { Speciality } from 'src/app/Hospital/models/speciality';
import { SpecialityStore } from 'src/app/Hospital/Store/Speciality/speciality.store';

@Component({
  selector: 'app-speciality-form',
  imports: [InputComponent, ToggleBtnComponent, ButtonComponent,ReactiveFormsModule],
  templateUrl: './speciality-form.component.html',
  styleUrl: './speciality-form.component.scss'
})
export class SpecialityFormComponent {
  @Output() cancalEvent = new EventEmitter<any>();
  oid = input<string>('');
  fb = inject(FormBuilder);
  store = inject(SpecialityStore);
  specialities = computed(() => this.store.specialities());

  form = this.fb.group({
    code: ['', Validators.required],
    nameAr: ['', Validators.required],
    nameEn: ['', Validators.required],
    defaultVisitDuration: [180, Validators.required],
    defaultPrice: [999999.99, Validators.required],
    isActive: [false, Validators.required],
  });

  private backendErrorKeyMap: Record<string, string[]> = {
    code: ['code'],
    nameAr: ['nameAr'],
    nameEn: ['nameEn'],
    defaultVisitDuration: ['defaultVisitDuration'],
    defaultPrice: ['defaultPrice'],
  };
  constructor() {

    effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.form.reset();
        return;
      }
      this.store.getSpeciality(oid);
    });

    effect(() => {
      const speciality = this.store.selectedSpeciality();
      if (speciality) {
        this.form.patchValue({
          code: speciality.code,
          nameAr: speciality.nameAr,
          nameEn: speciality.nameEn,
          defaultPrice: speciality.defaultPrice,
          defaultVisitDuration: speciality.defaultVisitDuration,
          isActive: speciality.isActive,
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
      this.createSpeciality();
    }
    if (this.form.valid && this.oid()) {
      this.editSpeciality();
    }
  }
  createSpeciality() {
    this.store.addSpeciality(this.getPayload());
  }
  editSpeciality() {
    this.store.updateSpeciality({ id: this.oid(), body: this.getPayload() });

  }

  getPayload() {
    const v = this.form.getRawValue();
    const payload: Speciality = {
      ...(this.oid() ? { oid: this.oid() } : {}),
      code: v.code!,
      nameAr: v.nameAr!,
      nameEn: v.nameEn!,
      defaultPrice: v.defaultPrice!,
      defaultVisitDuration: v.defaultVisitDuration!,
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
