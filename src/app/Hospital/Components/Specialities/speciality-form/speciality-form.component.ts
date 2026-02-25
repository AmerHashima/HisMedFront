import { Component, computed, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { InputComponent } from 'src/app/common/input/input.component';
import { ToggleBtnComponent } from 'src/app/common/toggle-btn/toggle-btn.component';
import { Speciality } from 'src/app/Hospital/models/speciality';
import { SpecialityStore } from 'src/app/Hospital/Store/Speciality/speciality.store';
import { ValidationErrorService } from '../../../../common/service/validation-error.service';

@Component({
  selector: 'app-speciality-form',
  imports: [InputComponent, ToggleBtnComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './speciality-form.component.html',
  styleUrl: './speciality-form.component.scss'
})
export class SpecialityFormComponent {
  @Output() cancalEvent = new EventEmitter<any>();

  oid = input<string>('');
  fb = inject(FormBuilder);
  store = inject(SpecialityStore);
  validationErrorService = inject(ValidationErrorService);
  specialities = computed(() => this.store.items());

  form = this.fb.group({
    code: ['', Validators.required],
    nameAr: ['', Validators.required],
    nameEn: ['', Validators.required],
    defaultVisitDuration: [180, [Validators.required, Validators.pattern(/^\d+$/)]],
    defaultPrice: [999999.99, [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/)
    ]],
    isActive: [false, Validators.required],
  });

  apiFieldErrors: Record<string, string> = {};

  // Map backend validation keys to form controls
  private backendErrorKeyMap: Record<string, string[]> = {
    code: ['Code'],
    nameAr: ['nameAr'],
    nameEn: ['nameEn'],
    defaultPrice: ['defaultPrice'],
    defaultVisitDuration: ['defaultVisitDuration'],
    createSpecialtyDto: ['createSpecialtyDto'],
  };

  constructor() {
    // Load speciality if editing
    effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.form.reset();
        return;
      }
      this.store.getSpeciality(oid);
    });

    // Patch form when selected item changes
    effect(() => {
      const speciality = this.store.selectedItem();
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

    // Handle success
    effect(() => {
      const success = this.store.success();
      if (success) this.cancel();
      this.store.setSuccess(false);
    });
  }


  /** Submit handler */
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.oid()) this.createSpeciality();
    if (this.oid()) this.editSpeciality();
  }

  createSpeciality() {
    this.store.addSpeciality(this.getPayload());
  }

  editSpeciality() {
    this.store.updateSpeciality({ id: this.oid(), body: this.getPayload() });
  }

  /** Get form payload */
  getPayload(): Speciality {
    const v = this.form.getRawValue();
    return {
      ...(this.oid() ? { oid: this.oid() } : {}),
      code: v.code!,
      nameAr: v.nameAr!,
      nameEn: v.nameEn!,
      defaultPrice: v.defaultPrice!,
      defaultVisitDuration: v.defaultVisitDuration!,
      isActive: v.isActive ?? true,
    };
  }

  /** Cancel / reset form */
  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.cancalEvent.emit();
  }

}
