import { Component, effect, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LookupService } from 'src/app/common/service/lookup.service';
import { LOOKUPStore } from '../../store/lookup.store';
import { APILookupDetail, LookUPMaster } from '../../models/lookup';
import { InputComponent } from 'src/app/common/input/input.component';
import { ToggleBtnComponent } from 'src/app/common/toggle-btn/toggle-btn.component';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { ReusableMaterialTableComponent } from 'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
import { Sort } from '@angular/material/sort';
import { setSelectedItem } from 'src/app/common/store/generic-updaters';
import { ValidationErrorService } from 'src/app/common/service/validation-error.service';

@Component({
  selector: 'app-look-up-master-form',
  imports: [InputComponent,ToggleBtnComponent,ButtonComponent,ReactiveFormsModule,ReusableMaterialTableComponent],
  templateUrl: './look-up-master-form.component.html',
  styleUrl: './look-up-master-form.component.scss',
})
export class LookUpMasterFormComponent {
  private store = inject(LOOKUPStore);
  @Output() cancalEvent = new EventEmitter<any>();
  @Output() viewMode = new EventEmitter<{ viewMode: string, action:string}>();

  lookupCode = input<string>('');
   details=signal<APILookupDetail[]>([]);
  fb = inject(FormBuilder);

  form = this.fb.group({
    lookupCode: ['', [Validators.required]],
    lookupNameAr: ['', [Validators.required]],
    lookupNameEn: ['', [Validators.required]],
    description: ['', [Validators.required]],
    isSystem: [false],
  });


  columns = [
    { field: 'valueCode', header: 'Detail Code', type: 'text' },
    { field: 'valueNameEn', header: 'Name', type: 'text' },
    { field: 'valueNameAr', header: 'Arabic Name', type: 'text' },
    { field: 'sortOrder', header: 'Order', type: 'text' },
    {
      field: 'isDefault',
      header: 'Default Value',
      type: 'badge',
      badge: {
        trueLabel: 'Yes',
        falseLabel: 'No',
        trueClass: 'bg-success',
        falseClass: 'bg-danger'
      }
    },
    // { field: 'actions', header: 'Actions', type: 'buttons' }
  ];

  handleSingleLookupMasterNavigation(row: any) {
    this.viewMode.emit({viewMode: 'detailsForm', action: 'navigate'});
  }

  handleAddNewDetails() {
  this.viewMode.emit({ viewMode: 'detailsForm', action: 'add'});
};

  private backendErrorKeyMap: Record<string, string[]> = {
    lookupCode: ['lookupCode'],
    lookupNameAr: ['lookupNameAr'],
    lookupNameEn: ['lookupNameEn'],
  };

  validationErrorService = inject(ValidationErrorService);

  apiFieldErrors: Record<string, string> = {};

  constructor() {
    effect(() => {
      const lookupCode = this.lookupCode();
      if (!lookupCode) {
        this.form.reset();
        return;
      }
      this.store.getLookupByCode(lookupCode);
    });

    effect(() => {
      const lookupMaster = this.store.selectedItem();
      console.log('in lookuomaster effect', lookupMaster);

      if (lookupMaster) {
        this.details.set(lookupMaster.lookupDetails);
        this.form.patchValue({
          lookupCode: this.lookupCode(),
          lookupNameAr: lookupMaster.lookupNameAr,
          lookupNameEn: lookupMaster.lookupNameEn,
          description: lookupMaster.description,
          isSystem: lookupMaster.isSystem,
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
      console.log('success',success);
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
    console.log('in component cancal');
    this.cancalEvent.emit();
    // this.router.navigateByUrl("/users");
  }

}
