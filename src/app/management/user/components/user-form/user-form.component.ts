import { Component, computed, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersStore } from '../../userStore/userStore';
import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { InputComponent } from 'src/app/common/input/input.component';
import { ToggleBtnComponent } from 'src/app/common/toggle-btn/toggle-btn.component';
import SpkFlatpickrComponent from 'src/app/common/spk-flatpickr/spk-flatpickr.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-user-form',
  imports: [SpkNgSelectComponent, ButtonComponent, InputComponent, ToggleBtnComponent, SpkFlatpickrComponent, ReactiveFormsModule],
  providers: [UsersStore],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  @Output() cancalEvent=new EventEmitter<any>();
  oid=input<string>('');
  genderOptions = [
    { label: "Female", value: "f" },
    { label: "Male", value: "m" }
  ]
  fb = inject(FormBuilder);
  store = inject(UsersStore);
  // private route = inject(ActivatedRoute);
  // private router = inject(Router);
  id:string='';

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    middleName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    twoFactorEnabled: [false],
    isActive: [false],
    gender: ['', Validators.required],
    birthDate: ['', Validators.required],
  });

  constructor() {

    if (this.oid())
      this.store.getUser(this.oid());
    // if (this.type() == "edit" || this.type() == "single"){
    effect(() => {
      const user = this.store.selectedUser();
      console.log('user');
      if (user) {
        this.form.patchValue({
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          twoFactorEnabled: user.twoFactorEnabled,
          isActive: user.isActive,
          gender: user.gender ? user.gender.toLowerCase() : null,
          birthDate: user.birthDate,
        });
      }
    });
  // }
  }

  // ngOnInit() {
  //   // if (this.type() == 'edit' || this.type() == 'single' ){
  //   //   console.log('in here');
  //   //  this.id = this.route.snapshot.paramMap.get('id')!;
  //   if(this.id)
  //     this.store.getUser(this.id);
  // }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.valid && !this.id) {
      console.log('create Form submitted:', this.form.value);
    }
    if (this.form.valid && this.id) {
      console.log('edit Form submitted:', this.form.value);
    }
  }

  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.cancalEvent.emit();
    // this.router.navigateByUrl("/users");
  }
  back(){
    this.cancalEvent.emit();

    // this.router.navigateByUrl("/users");
  }
}
