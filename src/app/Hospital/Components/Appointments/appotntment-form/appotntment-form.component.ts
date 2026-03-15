// // src\app\Hospital\Components\Appointments\appotntment-form\appotntment-form.component.ts
// import { AsyncPipe } from '@angular/common';
// import { Component, computed, effect, EventEmitter, inject, input, Output } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ButtonComponent } from 'src/app/common/button/button.component';
// import { LookupService } from 'src/app/common/service/lookup.service';
// import { ValidationErrorService } from 'src/app/common/service/validation-error.service';
// import SpkFlatpickrComponent from 'src/app/common/spk-flatpickr/spk-flatpickr.component';
// import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
// import { DoctorStore } from 'src/app/doctors/doctorStore/doctorStore';
// import { Appointment } from 'src/app/Hospital/models/appointment';
// import { AppointmentStore } from 'src/app/Hospital/Store/Appointment/appointment.store';
// import { BranchStore } from 'src/app/Hospital/Store/Branch/branch.store';
// import { PatientStore } from 'src/app/patients/patientStore/patient.store';

// @Component({
//   selector: 'app-appointment-form',
//   imports: [ReactiveFormsModule, SpkNgSelectComponent,
//     SpkFlatpickrComponent, ButtonComponent, AsyncPipe
//   ],
//   templateUrl: './appotntment-form.component.html',
//   styleUrl: './appotntment-form.component.scss'
// })
// export class AppotntmentFormComponent {
//   private lookupService = inject(LookupService);
//   appointmentStatues$ = this.lookupService.getAppointmentStatus();
//   appointmentTypes$ = this.lookupService.getAppointmentTypes();
//   appointmentReasons$ = this.lookupService.getAppointmentReasons();

//   @Output() cancalEvent = new EventEmitter<any>();
//   oid = input<string>('');
//   fb = inject(FormBuilder);
//   store = inject(AppointmentStore);
//   doctorStore = inject(DoctorStore);
//   patientStore = inject(PatientStore);
//   branchStore = inject(BranchStore);
//   validationErrorService = inject(ValidationErrorService);

//   doctors = computed(() => this.doctorStore.doctors());
//   patients = computed(() => this.patientStore.patients());
//   branches = computed(() => this.branchStore.items());


//   form = this.fb.group({
//     patientId: ['', Validators.required],
//     doctorId: ['', Validators.required],
//     appointmentDate: ['', Validators.required],
//     appointmentType: ['', Validators.required],
//     branchId: ['', Validators.required],
//     status: ['', Validators.required],
//     reason: ['', Validators.required],
//   });

//   private backendErrorKeyMap: Record<string, string[]> = {
//     patientId: ['patientId'],
//     doctorId: ['licendoctorIdseNumber'],
//     appointmentDate: ['appointmentDate'],
//     appointmentType: ['appointmentType'],
//     branchId: ['branchId'],
//     status: ['status'],
//     reason: ['resason'],
//   };
//   apiFieldErrors: Record<string, string> = {};
//   constructor() {

//     effect(() => {
//       const oid = this.oid();
//       if (!oid) {
//         this.form.reset();
//         return;
//       }
//       this.store.getAppointment(oid);
//     });

//     effect(() => {
//       const appointment = this.store.selectedItem();
//       if (appointment) {
//         this.form.patchValue({
//           patientId: appointment.patientId,
//           doctorId: appointment.doctorId,
//           appointmentDate: appointment.appointmentDate,
//           appointmentType: appointment.appointmentType,
//           branchId: appointment.branchId,
//           status: appointment.status,
//           reason: appointment.reason,
//         });
//       }
//     });


//     effect(() => {
//       const error = this.store.error();

//       if (!error) {
//         this.validationErrorService.clearErrors(this.form, this.apiFieldErrors);
//       } else {
//         this.validationErrorService.handleApiErrors(
//           this.form,
//           error,
//           this.backendErrorKeyMap,
//           this.apiFieldErrors
//         );
//       }
//     });

//     effect(() => {
//       const success = this.store.success();
//       if (success)
//         this.cancel();
//       this.store.setSuccess(false);
//     });

//   }



//   onSubmit() {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }
//     if (this.form.valid && !this.oid()) {
//       this.createAppointment();
//     }
//     if (this.form.valid && this.oid()) {
//       this.editAppointment();
//     }
//   }
//   createAppointment() {
//     this.store.addAppointment(this.getPayload());
//   }
//   editAppointment() {
//     console.log('in edit');
//     this.store.updateAppointment({ id: this.oid(), body: this.getPayload() });

//   }

//   getPayload() {
//     const v = this.form.getRawValue();
//     const payload: Appointment = {
//       ...(this.oid() ? { oid: this.oid() } : {}),
//       patientId: v.patientId!,
//       doctorId: v.doctorId!,
//       appointmentDate: v.appointmentDate!,
//       appointmentType: v.appointmentType!,
//       status: v.status!,
//       reason: v.reason!,
//       branchId: v.branchId!,
//     };
//     console.log(payload);
//     return payload;
//   }
//   cancel() {
//     this.form.markAsUntouched();
//     this.form.reset();
//     this.cancalEvent.emit();
//   }
//   back() {
//     this.cancalEvent.emit();
//   }
// }



import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';


import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
import { ButtonComponent } from 'src/app/common/button/button.component';
import SpkFlatpickrComponent from 'src/app/common/spk-flatpickr/spk-flatpickr.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Slot {
  time: string;
  booked: boolean;
}

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpkNgSelectComponent,
    SpkFlatpickrComponent,
    ButtonComponent,
    FullCalendarModule
  ],
  templateUrl: './appotntment-form.component.html',
   styleUrl: './appotntment-form.component.scss'
})
export class AppotntmentFormComponent {
  oid=input<string>('');
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

    initialView: 'timeGridDay',

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek,dayGridMonth'
    },

    selectable: true,

    select: (info) => {
      console.log('Selected slot', info.startStr);
    },

    events: [
      {
        title: 'Appointment - John',
        start: '2026-03-13T10:00:00',
        end: '2026-03-13T10:30:00'
      }
    ]
  };
}
