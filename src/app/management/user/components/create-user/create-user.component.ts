import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { InputComponent } from 'src/app/common/input/input.component';
import { ToggleBtnComponent } from 'src/app/common/toggle-btn/toggle-btn.component';
import { FileUploadComponent } from 'src/app/common/file-upload/file-upload.component';
import SpkFlatpickrComponent from 'src/app/common/spk-flatpickr/spk-flatpickr.component';
@Component({
  selector: 'app-create-user',
  imports: [InputComponent, ReactiveFormsModule, ButtonComponent, ToggleBtnComponent,
    SpkNgSelectComponent, FileUploadComponent, SpkFlatpickrComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  @ViewChild('fileUpload') fileUpload!: FileUploadComponent;
  genderOptions=[
    {label :"Female" , value:"f" },
    { label: "Male", value: "m" }
  ]
  fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    middleName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    twoFactorEnabled: [false, [Validators.requiredTrue]],
    isActive: [false],
    gender: ['', [Validators.required]],
    files: [[], [Validators.required]],
    birthDate: [null, [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.fileUpload.uploadAll('');
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
    }
  }

  cancel(){
    this.form.markAsUntouched();
    this.form.reset();
  }
}
