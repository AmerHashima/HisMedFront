import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
import { LOOKUPStore } from '../../store/lookup.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LookupDetail } from '../../models/lookup';
import { InputComponent } from 'src/app/common/input/input.component';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { ToggleBtnComponent } from 'src/app/common/toggle-btn/toggle-btn.component';
import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
import { ValidationErrorService } from 'src/app/common/service/validation-error.service';

@Component({
  selector: 'app-look-up-details-form',
  imports: [SpkNgSelectComponent,InputComponent,ButtonComponent,ToggleBtnComponent,ReactiveFormsModule],
  templateUrl: './look-up-details-form.component.html',
  styleUrl: './look-up-details-form.component.scss'
})
export class LookUpDetailsFormComponent {
  private store = inject(LOOKUPStore);
  masterLookUps = this.store.items
  @Output() cancalEvent = new EventEmitter<any>();
  // oid = input<string>('');

  fb = inject(FormBuilder);
  // id: string = '';

  form = this.fb.group({
    lookupMasterID: ['', [Validators.required]],
    valueCode: ['', [Validators.required]],
    valueNameAr: ['', [Validators.required]],
    valueNameEn: ['', [Validators.required]],
    sortOrder: [0, [Validators.required]],
    isDefault: [false],
  });

  private backendErrorKeyMap: Record<string, string[]> = {
    valueCode: ['valueCode'],
    valueNameAr: ['valueNameAr'],
    valueNameEn: ['valueNameEn'],
    sortOrder: ['SortOrder']
  };
    validationErrorService = inject(ValidationErrorService);

    apiFieldErrors: Record<string, string> = {};
  constructor() {

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
    if (this.form.valid) {
      this.createLookupDetails();
    }
  }
  createLookupDetails() {
    this.store.addLookUpDetail(this.getPayload());
  }


  getPayload() {
    const v = this.form.getRawValue();
    const payload: LookupDetail = {
      lookupMasterID: v.lookupMasterID!,
      valueCode: v.valueCode!,
      valueNameAr: v.valueNameAr!,
      valueNameEn: v.valueNameEn!,
      sortOrder: v.sortOrder!,
      isDefault: v.isDefault ?? true,
    };
    console.log('detail payload',payload);
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
