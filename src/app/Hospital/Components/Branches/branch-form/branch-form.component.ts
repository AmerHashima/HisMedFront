import { Component, computed, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { InputComponent } from 'src/app/common/input/input.component';
import { ValidationErrorService } from 'src/app/common/service/validation-error.service';
import { ToggleBtnComponent } from 'src/app/common/toggle-btn/toggle-btn.component';
import { Branch } from 'src/app/Hospital/models/branch';
import { BranchStore } from 'src/app/Hospital/Store/Branch/branch.store';
import { LookupService } from 'src/app/common/service/lookup.service';
import { SpkNgSelectComponent } from 'src/app/@spk/spk-ng-select/spk-ng-select.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-branch-form',
  imports: [InputComponent,ReactiveFormsModule,ToggleBtnComponent,ButtonComponent,SpkNgSelectComponent,AsyncPipe],
  templateUrl: './branch-form.component.html',
  styleUrl: './branch-form.component.scss'
})
export class BranchFormComponent {
  @Output() cancalEvent = new EventEmitter<any>();
  oid = input<string>('');
  fb = inject(FormBuilder);
  store = inject(BranchStore);
    validationErrorService = inject(ValidationErrorService);
  lookupService = inject(LookupService);
  // specialities = computed(() => this.store.specialities());
  branches = computed(() => this.store.items());
  form = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: [''],
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
  apiFieldErrors: Record<string, string> = {};
  countries$ = this.lookupService.getCountries();
  cities$ = this.lookupService.getCities();
  states$ = this.lookupService.getStates();

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
          state: branch.state?branch.state : null,
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
      state: v.state?v.state:null,
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
