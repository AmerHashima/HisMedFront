import { AsyncPipe } from '@angular/common';
import { Component, computed, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { InputComponent } from 'src/app/common/input/input.component';
import { LookupService } from 'src/app/common/service/lookup.service';
import SpkFlatpickrComponent from 'src/app/common/spk-flatpickr/spk-flatpickr.component';
import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
import { DoctorStore } from 'src/app/doctors/doctorStore/doctorStore';
import { Appointment } from 'src/app/Hospital/models/appointment';
import { AppointmentStore } from 'src/app/Hospital/Store/Appointment/appointment.store';
import { BranchStore } from 'src/app/Hospital/Store/Branch/branch.store';
import { PatientStore } from 'src/app/patients/patientStore/patient.store';

@Component({
  selector: 'app-appointment-form',
  imports: [ReactiveFormsModule,InputComponent,SpkNgSelectComponent,
    SpkFlatpickrComponent,ButtonComponent,AsyncPipe
  ],
  templateUrl: './appotntment-form.component.html',
  styleUrl: './appotntment-form.component.scss'
})
export class AppotntmentFormComponent {
    private lookupService=inject(LookupService);
  appointmentStatues$ = this.lookupService.getAppointmentStatus();

  @Output() cancalEvent = new EventEmitter<any>();
  oid = input<string>('');
  fb = inject(FormBuilder);
  store = inject(AppointmentStore);
  doctorStore = inject(DoctorStore);
  patientStore = inject(PatientStore);
  branchStore = inject(BranchStore);
  doctors = computed(() => this.doctorStore.doctors());
  patients = computed(() => this.patientStore.patients());
  branches = computed(() => this.branchStore.items());


  form = this.fb.group({
    patientId: ['', Validators.required],
    doctorId: ['', Validators.required],
    appointmentDate: ['', Validators.required],
    appointmentType: ['', Validators.required],
    branchId: ['', Validators.required],
    status: ['', Validators.required],
    reason: ['', Validators.required],
  });

  private backendErrorKeyMap: Record<string, string[]> = {
    patientId: ['patientId'],
    doctorId: ['licendoctorIdseNumber'],
    appointmentDate: ['appointmentDate'],
    appointmentType: ['appointmentType'],
    branchId: ['branchId'],
    status: ['status'],
    reason: ['resason'],

  };
  constructor() {

    effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.form.reset();
        return;
      }
      this.store.getAppointment(oid);
    });

    effect(() => {
      const appointment = this.store.selectedItem();
      if (appointment) {
        this.form.patchValue({
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          appointmentDate: appointment.appointmentDate,
          appointmentType: appointment.appointmentType,
          branchId: appointment.branchId,
          status: appointment.status,
          reason: appointment.reason,
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
      this.createAppointment();
    }
    if (this.form.valid && this.oid()) {
      this.editAppointment();
    }
  }
  createAppointment() {
    this.store.addAppointment(this.getPayload());
  }
  editAppointment() {
    console.log('in edit');
    this.store.updateAppointment({ id: this.oid(), body: this.getPayload() });

  }

  getPayload() {
    const v = this.form.getRawValue();
    const payload: Appointment = {
      ...(this.oid() ? { oid: this.oid() } : {}),

      patientId: v.patientId!,
      doctorId: v.doctorId!,
      appointmentDate: v.appointmentDate!,
      appointmentType: v.appointmentType!,
      status: v.status!,
      reason: v.reason!,
      branchId: v.branchId!,
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
