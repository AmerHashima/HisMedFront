import { Component, computed, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { DoctorStore } from '../../doctorStore/doctorStore';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Doctor } from '../../models/doctor';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { ToggleBtnComponent } from 'src/app/common/toggle-btn/toggle-btn.component';
import { InputComponent } from 'src/app/common/input/input.component';
import { UsersStore } from 'src/app/management/user/userStore/userStore';
import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
import { LookupService } from 'src/app/common/service/lookup.service';
import { AsyncPipe } from '@angular/common';
import { HospitalBranchService } from 'src/app/common/service/hospital-branch.service';
import { SpecialityService } from 'src/app/common/service/speciality.service';

@Component({
  selector: 'app-doctor-form',
  imports: [ButtonComponent,ToggleBtnComponent,InputComponent,
    SpkNgSelectComponent  ,ReactiveFormsModule,AsyncPipe],
  templateUrl: './doctor-form.component.html',
  styleUrl: './doctor-form.component.scss',
  providers: [UsersStore]

})
export class DoctorFormComponent {
  @Output() cancalEvent = new EventEmitter<any>();
  oid = input<string>('');
  fb = inject(FormBuilder);
  store = inject(DoctorStore);
  userStore=inject(UsersStore);
  lookupService = inject(LookupService);
  branchService = inject(HospitalBranchService);
  specialityService=inject(SpecialityService);
  users=computed(()=> this.userStore.users());
  departments$ = this.lookupService.getDepartment();
  branches$ = this.branchService.getBranches();
  specialities$ = this.specialityService.getSpecialities();

  form = this.fb.group({
    userId: ['', Validators.required],
    licenseNumber: ['', Validators.required],
    specialtyId: ['', Validators.required],
    departmentLookupId: ['', Validators.required],
    branchId: ['', Validators.required],
    nphiesProviderId: ['', Validators.required],
    isNphiesEnabled: [false, Validators.required],
    isActive: [false, Validators.required],
  });

  private backendErrorKeyMap: Record<string, string[]> = {
    userId: ['userId'],
    licenseNumber: ['licenseNumber'],
    specialtyId: ['specialtyId'],
  };
  constructor() {

    effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.form.reset();
        return;
      }
      this.store.getDoctor(oid);
    });

    effect(() => {
      const doctor = this.store.selectedDoctor();
      if (doctor) {
        this.form.patchValue({
          userId: doctor.userId,
          licenseNumber: doctor.licenseNumber,
          specialtyId: doctor.specialtyId,
          departmentLookupId: doctor.departmentLookupId,
          branchId: doctor.branchId,
          nphiesProviderId: doctor.nphiesProviderId,
          isActive: doctor.isActive,
          isNphiesEnabled: doctor.isNphiesEnabled,
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
      this.createDoctor();
    }
    if (this.form.valid && this.oid()) {
      this.editDoctor();
    }
  }
  createDoctor() {
    this.store.addDoctor(this.getPayload());
  }
  editDoctor() {
    console.log('in edit');
    this.store.updateDoctor({ id: this.oid(), body: this.getPayload() });

  }

  getPayload() {
    const v = this.form.getRawValue();
    const payload: Doctor = {
      ...(this.oid() ? { oid: this.oid() } : {}),

      userId: v.userId!,
      licenseNumber: v.licenseNumber!,
      branchId: v.branchId!,
      specialtyId: v.specialtyId!,
      departmentLookupId: v.departmentLookupId!,
      nphiesProviderId: v.nphiesProviderId!,
      isNphiesEnabled: v.isNphiesEnabled ?? false,
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
