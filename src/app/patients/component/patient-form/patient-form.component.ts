import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientStore } from '../../patientStore/patient.store';
import { LookupService } from 'src/app/common/service/lookup.service';
import { HospitalBranchService } from 'src/app/Hospital/Services/hospital-branch.service';
import { notInFutureValidator } from 'src/app/common/validators/notInFutureValidator';
import { Patient } from '../../models/patient';
import { ButtonComponent } from 'src/app/common/button/button.component';
import SpkFlatpickrComponent from 'src/app/common/spk-flatpickr/spk-flatpickr.component';
import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
import { InputComponent } from 'src/app/common/input/input.component';
import { AsyncPipe } from '@angular/common';
import { ValidationErrorService } from 'src/app/common/service/validation-error.service';

@Component({
  selector: 'app-patient-form',
  imports: [ButtonComponent, SpkFlatpickrComponent, SpkNgSelectComponent,
    InputComponent, AsyncPipe, ReactiveFormsModule],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss'
})
export class PatientFormComponent {
  @Output() cancalEvent = new EventEmitter<any>();
  @Output() setToastObject = new EventEmitter<any>();
  oid = input<string>('');
  fb = inject(FormBuilder);
  store = inject(PatientStore);
  lookupService = inject(LookupService);
  branchService = inject(HospitalBranchService);
  validationErrorService = inject(ValidationErrorService);
  branches$ = this.branchService.getBranches();
  bloodGroups$ = this.lookupService.getBloodGroup();
  maritalStatues$ = this.lookupService.getMaritalStatus();
  natiinalities$ = this.lookupService.getNationality();
  identityTypes$ = this.lookupService.getIdentityType();
  gender$ = this.lookupService.getGender();

  form = this.fb.group({
    branchId: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    mobile: ['', [Validators.required]],
    bloodGroupLookupId: ['', [Validators.required]],
    maritalStatusLookupId: ['', [Validators.required]],
    nationalityLookupId: ['', [Validators.required]],
    identityNumber: ['', [Validators.required]],
    identityTypeLookupId: ['', [Validators.required]],
    genderLookupId: ['', [Validators.required]],
    birthDate: ['', [Validators.required, notInFutureValidator()]],
    firstNameEn: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    middleNameEn: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    lastNameEn: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    firstNameAr: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    middleNameAr: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    lastNameAr: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
  });

  apiFieldErrors: Record<string, string> = {};

  private backendErrorKeyMap: Record<string, string[]> = {
    email: ['email'],
    phone: ['phone'],
    mobile: ['mobile'],
    lastNameAr: ['lastNameAr'],
    middleNameEn: ['middleNameEn'],
    middleNameAr: ['middleNameAr'],
    firstNameAr: ['firstNameAr'],
    firstNameEn: ['firstNameEn'],
    lastNameEn: ['lastNameEn'],
    birthDate: ['birthDate'],
  };
  constructor() {

    effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.form.reset();
        return;
      }
      this.store.getPatient(oid);
    });

    effect(() => {
      const patient = this.store.selectedPatient();
      if (patient) {
        this.form.patchValue({
          lastNameAr: patient.lastNameAr,
          middleNameAr: patient.middleNameAr,
          firstNameAr: patient.firstNameAr,
          lastNameEn: patient.lastNameEn,
          middleNameEn: patient.middleNameEn,
          firstNameEn: patient.firstNameEn,
          birthDate: patient.birthDate,
          genderLookupId: patient.genderLookupId,
          identityTypeLookupId: patient.identityTypeLookupId,
          identityNumber: patient.identityNumber,
          nationalityLookupId: patient.nationalityLookupId,
          maritalStatusLookupId: patient.maritalStatusLookupId,
          bloodGroupLookupId: patient.bloodGroupLookupId,
          mobile: patient.mobile,
          phone: patient.phone,
          email: patient.email,
          branchId: patient.branchId,
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
      if (success) {
        this.cancel();
        this.setToastObject.emit({
          title: 'Success',
          content: "Patient has been safed successfully"
        })
      }
      this.store.setSuccess(false);
    });

  }


  // logInvalidControls() {
  //   const invalidControls: string[] = [];

  //   // Simple version (flat form)
  //   Object.keys(this.form.controls).forEach(key => {
  //     const control = this.form.get(key);
  //     if (control?.invalid) {
  //       invalidControls.push(key);
  //       console.log(`Field "${key}" is invalid.`, {
  //         value: control.value,
  //         errors: control.errors,           // ← shows exactly which validator failed
  //         status: control.status,
  //         touched: control.touched,
  //         dirty: control.dirty
  //       });
  //     }
  //   });

  //   // If you have nested FormGroups or FormArrays → use recursive version below

  //   console.log('Invalid fields:', invalidControls);
  //   if (invalidControls.length === 0) {
  //     console.log('Form is actually valid (or no controls found)');
  //   }

  //   return invalidControls;
  // }

  onSubmit() {
    // this.logInvalidControls();
    //    console.log('form',this.form);
    //   console.log(this.form.invalid);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.valid && !this.oid()) {
      this.createPatient();
    }
    if (this.form.valid && this.oid()) {
      this.editPatient();
    }
  }
  createPatient() {
    this.store.addPatient(this.getPayload());
  }
  editPatient() {
    this.store.updatePatient({ id: this.oid(), body: this.getPayload() });

  }

  formatDateOnly(value: string | Date): string {
    const d = new Date(value);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getPayload() {
    const patient = this.form.getRawValue();
    const birthday = this.formatDateOnly(patient.birthDate!)
    const payload: Patient = {
      ...(this.oid() ? { oid: this.oid() } : {}),
      lastNameAr: patient.lastNameAr!,
      middleNameAr: patient.middleNameAr!,
      firstNameAr: patient.firstNameAr!,
      lastNameEn: patient.lastNameEn!,
      middleNameEn: patient.middleNameEn!,
      firstNameEn: patient.firstNameEn!,
      birthDate: birthday,
      genderLookupId: patient.genderLookupId!,
      identityTypeLookupId: patient.identityTypeLookupId!,
      identityNumber: patient.identityNumber!,
      nationalityLookupId: patient.nationalityLookupId!,
      maritalStatusLookupId: patient.maritalStatusLookupId!,
      bloodGroupLookupId: patient.bloodGroupLookupId!,
      mobile: patient.mobile!,
      phone: patient.phone!,
      email: patient.email!,
      branchId: patient.branchId!,
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
