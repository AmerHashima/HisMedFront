// src\app\patients\component\patient-form\patient-form.component.ts
import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientStore } from '../../patientStore/patient.store';
import { LookupService } from 'src/app/common/service/lookup.service';
import { HospitalBranchService } from 'src/app/Hospital/Services/hospital-branch.service';
import { notInFutureValidator } from 'src/app/common/validators/notInFutureValidator';
import { Patient } from '../../models/patient';
import { ButtonComponent } from 'src/app/common/button/button.component';
import SpkFlatpickrComponent from 'src/app/common/spk-flatpickr/spk-flatpickr.component';
import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
import { InputComponent } from 'src/app/common/input/input.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ValidationErrorService } from 'src/app/common/service/validation-error.service';
import { FileUploadComponent } from 'src/app/common/file-upload/file-upload.component';

@Component({
  selector: 'app-patient-form',
  imports: [ButtonComponent, SpkFlatpickrComponent, SpkNgSelectComponent,
    InputComponent, AsyncPipe, ReactiveFormsModule, NgFor, NgIf, FileUploadComponent],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss'
})
export class PatientFormComponent {
  @Output() cancalEvent = new EventEmitter<any>();
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
  countries$ = this.lookupService.getCountries();
  cities$ = this.lookupService.getCities();
  relationshipTypes$ = this.lookupService.getLookUpByCode('RELATIONSHIP');
  attachmentTypes$ = this.lookupService.getLookUpByCode('ATTACHMENT_TYPE');
  insuranceCompanies$ = this.lookupService.getLookUpByCode('INSURANCE_COMPANY');

  showAddresses = true;
  showContacts = true;
  showAttachments = true;
  showInsurances = true;

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
    addresses: this.fb.array([this.createAddressGroup()]),
    contacts: this.fb.array([this.createContactGroup()]),
    attachments: this.fb.array([this.createAttachmentGroup()]),
    insurances: this.fb.array([this.createInsuranceGroup()]),
  });

  apiFieldErrors: Record<string, string> = {};

  private backendErrorKeyMap: Record<string, string[]> = {
    email: ['email'],
    phone: ['phone'],
    mobile: ['Mobile'],
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
        this.setFormArray('addresses', patient.addresses ?? [], () => this.createAddressGroup());
        this.setFormArray('contacts', patient.contacts ?? [], () => this.createContactGroup());
        this.setFormArray('attachments', patient.attachments ?? [], () => this.createAttachmentGroup());
        this.setFormArray('insurances', patient.insurances ?? [], () => this.createInsuranceGroup());
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
      }
      this.store.setSuccess(false);
    });

  }

  get addresses(): FormArray {
    return this.form.get('addresses') as FormArray;
  }

  get contacts(): FormArray {
    return this.form.get('contacts') as FormArray;
  }

  get attachments(): FormArray {
    return this.form.get('attachments') as FormArray;
  }

  get insurances(): FormArray {
    return this.form.get('insurances') as FormArray;
  }

  createAddressGroup(): FormGroup {
    return this.fb.group({
      countryId: ['', Validators.required],
      cityId: ['', Validators.required],
      district: ['', Validators.required],
      street: ['', Validators.required],
      buildingNumber: ['', Validators.required],
      postalCode: ['', Validators.required],
      additionalNumber: [''],
    });
  }

  createContactGroup(): FormGroup {
    return this.fb.group({
      contactName: ['', Validators.required],
      relationshipId: ['', Validators.required],
      mobile: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  createAttachmentGroup(): FormGroup {
    return this.fb.group({
      attachmentTypeId: ['', Validators.required],
      fileName: ['', Validators.required],
      filePath: ['', Validators.required],
      fileExtension: ['', Validators.required],
      fileSize: [0, [Validators.required, Validators.min(0)]],
      files: [null],
    });
  }

  createInsuranceGroup(): FormGroup {
    return this.fb.group({
      insuranceCompanyId: ['', Validators.required],
      policyNumber: ['', Validators.required],
      memberId: ['', Validators.required],
      insuranceClass: ['', Validators.required],
      startDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
    });
  }

  addAddress() {
    this.addresses.push(this.createAddressGroup());
  }

  removeAddress(index: number) {
    if (this.addresses.length > 1) {
      this.addresses.removeAt(index);
    }
  }

  addContact() {
    this.contacts.push(this.createContactGroup());
  }

  removeContact(index: number) {
    if (this.contacts.length > 1) {
      this.contacts.removeAt(index);
    }
  }

  addAttachment() {
    this.attachments.push(this.createAttachmentGroup());
  }

  removeAttachment(index: number) {
    if (this.attachments.length > 1) {
      this.attachments.removeAt(index);
    }
  }

  addInsurance() {
    this.insurances.push(this.createInsuranceGroup());
  }

  onAttachmentFilesChanged(index: number, files: File[]) {
    const group = this.attachments.at(index) as FormGroup;
    const file = files?.[0];
    if (!file) {
      group.patchValue({
        fileName: '',
        filePath: '',
        fileExtension: '',
        fileSize: 0,
      });
      return;
    }

    const extension = file.name.includes('.')
      ? `.${file.name.split('.').pop()}`
      : '';

    group.patchValue({
      fileName: file.name,
      filePath: file.name,
      fileExtension: extension,
      fileSize: file.size,
    });
  }

  removeInsurance(index: number) {
    if (this.insurances.length > 1) {
      this.insurances.removeAt(index);
    }
  }

  private setFormArray(
    key: 'addresses' | 'contacts' | 'attachments' | 'insurances',
    values: any[],
    fallbackFactory: () => FormGroup
  ) {
    const array = this.form.get(key) as FormArray;
    array.clear();
    if (!values.length) {
      array.push(fallbackFactory());
      return;
    }
    values.forEach((value) => array.push(this.fb.group(value)));
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
    const birthday = this.formatDateOnly(patient.birthDate!);
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
      addresses: ((patient.addresses ?? []) as Array<Record<string, unknown>>).map((address) => ({
        countryId: this.toStringValue(address['countryId']),
        cityId: this.toStringValue(address['cityId']),
        district: this.toStringValue(address['district']),
        street: this.toStringValue(address['street']),
        buildingNumber: this.toStringValue(address['buildingNumber']),
        postalCode: this.toStringValue(address['postalCode']),
        additionalNumber: this.toStringValue(address['additionalNumber']),
      })),
      contacts: ((patient.contacts ?? []) as Array<Record<string, unknown>>).map((contact) => ({
        contactName: this.toStringValue(contact['contactName']),
        relationshipId: this.toStringValue(contact['relationshipId']),
        mobile: this.toStringValue(contact['mobile']),
        phone: this.toStringValue(contact['phone']),
        email: this.toStringValue(contact['email']),
      })),
      attachments: ((patient.attachments ?? []) as Array<Record<string, unknown>>).map((attachment) => ({
        attachmentTypeId: this.toStringValue(attachment['attachmentTypeId']),
        fileName: this.toStringValue(attachment['fileName']),
        filePath: this.toStringValue(attachment['filePath']),
        fileExtension: this.toStringValue(attachment['fileExtension']),
        fileSize: Number(attachment['fileSize']) || 0,
        files: null,
      })),
      insurances: ((patient.insurances ?? []) as Array<Record<string, unknown>>).map((insurance) => ({
        insuranceCompanyId: this.toStringValue(insurance['insuranceCompanyId']),
        policyNumber: this.toStringValue(insurance['policyNumber']),
        memberId: this.toStringValue(insurance['memberId']),
        insuranceClass: this.toStringValue(insurance['insuranceClass']),
        startDate: this.formatDateOnly(this.toStringValue(insurance['startDate'])),
        expiryDate: this.formatDateOnly(this.toStringValue(insurance['expiryDate'])),
      })),
    };
    return payload;
  }

  private toStringValue(value: unknown): string {
    return value == null ? '' : String(value);
  }

  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.addresses.clear();
    this.contacts.clear();
    this.attachments.clear();
    this.insurances.clear();
    this.addAddress();
    this.addContact();
    this.addAttachment();
    this.addInsurance();
    this.cancalEvent.emit();
  }

}
