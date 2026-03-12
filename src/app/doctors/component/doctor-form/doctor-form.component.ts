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
import { HospitalBranchService } from 'src/app/Hospital/Services/hospital-branch.service';
import { SpecialityService } from 'src/app/Hospital/Services/speciality.service';
import { ValidationErrorService } from 'src/app/common/service/validation-error.service';
import { SpecialityStore } from 'src/app/Hospital/Store/Speciality/speciality.store';
import { WorkingDayCardComponent } from '../doctor-schedule-form/working-day-card/working-day-card.component';

@Component({
  selector: 'app-doctor-form',
  imports: [ButtonComponent, ToggleBtnComponent, InputComponent,
    SpkNgSelectComponent, ReactiveFormsModule, AsyncPipe, WorkingDayCardComponent],
  templateUrl: './doctor-form.component.html',
  styleUrl: './doctor-form.component.scss',
  providers: [UsersStore, SpecialityStore]

})
export class DoctorFormComponent {
  @Output() cancalEvent = new EventEmitter<any>();
  oid = input<string>('');
  fb = inject(FormBuilder);
  store = inject(DoctorStore);
  userStore = inject(UsersStore);
  lookupService = inject(LookupService);
  branchService = inject(HospitalBranchService);
  specialityService = inject(SpecialityService);
  specialityStore = inject(SpecialityStore);
  specialities=computed(()=> this.specialityStore.items())
    validationErrorService = inject(ValidationErrorService);
  doctorSchedules=this.store.selectedDoctorSchedules;
  users = computed(() => this.userStore.users());
  departments$ = this.lookupService.getDepartment();
  branches$ = this.branchService.getBranches();
  specialities$ = this.specialityService.getSpecialities();

  form = this.fb.group({
    userId: ['', Validators.required],
    licenseNumber: ['', Validators.required],
    specialtyId: ['', Validators.required],
    departmentLookupId: ['', Validators.required],
    branchId: ['', Validators.required],
    nphiesProviderId: [''],
    isNphiesEnabled: [false],
    isActive: [false],
  });

  private backendErrorKeyMap: Record<string, string[]> = {
    userId: ['userId'],
    licenseNumber: ['licenseNumber'],
    specialtyId: ['specialtyId'],
  };
  apiFieldErrors: Record<string, string> = {};

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
          nphiesProviderId: doctor.nphiesProviderId ?? null,
          isActive: doctor.isActive ?? false ,
          isNphiesEnabled: doctor.isNphiesEnabled ?? false,
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
      nphiesProviderId: v.nphiesProviderId ? v.nphiesProviderId :null,
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

  addAnotherWorkingHours() {
   }

}
