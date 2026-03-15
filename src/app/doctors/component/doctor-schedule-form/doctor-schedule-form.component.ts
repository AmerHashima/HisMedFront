// // import { Component, effect, EventEmitter, inject, input, Output, signal } from '@angular/core';
// // import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
// // import { LookupService } from 'src/app/common/service/lookup.service';
// // import { AsyncPipe } from '@angular/common';
// // import { DoctorStore } from '../../doctorStore/doctorStore';
// // import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// // import { ValidationErrorService } from 'src/app/common/service/validation-error.service';
// // import { ButtonComponent } from 'src/app/common/button/button.component';
// // import { DoctorSchedule } from '../../models/doctor-schedule';

// // @Component({
// //   selector: 'app-doctor-schedule-form',
// //   imports: [SpkNgSelectComponent, AsyncPipe,ReactiveFormsModule,
// //     ButtonComponent
// //   ],
// //   templateUrl: './doctor-schedule-form.component.html',
// //   styleUrl: './doctor-schedule-form.component.scss'
// // })
// // export class DoctorScheduleFormComponent {
// //   @Output() cancalEvent = new EventEmitter<any>();
// //   private lookupService = inject(LookupService);
// //   private store=inject(DoctorStore);
// //   doctors = this.store.doctors;
// //   weekDays$=this.lookupService.getDays();
// //   workingHours$=this.lookupService.getDayHours();
// //   slotDurations$ = this.lookupService.getSlotDuration();
// //   fb = inject(FormBuilder);
// //   id: string = '';
// //   validationErrorService = inject(ValidationErrorService);
// //   oid = input<string>('');

// //   form = this.fb.group({

// //     doctorId: [null, [Validators.required]],
// //     dayOfWeekId: [null, [Validators.required]],
// //     startTime: [null, [Validators.required]],
// //     endTime: [null, [Validators.required]],
// //     slotDurationMinutes: [null, [Validators.required]],

// //   });

// //   private backendErrorKeyMap: Record<string, string[]> = {
// //     doctorId: ['doctorId'],
// //     StartTime: ['startTime'],
// //     EndTime: ['endTime'],
// //   };
// //   apiFieldErrors: Record<string, string> = {};

// //   constructor(){
// //     effect(() => {
// //       const error = this.store.error();

// //       if (!error) {
// //         this.validationErrorService.clearErrors(this.form, this.apiFieldErrors);
// //       } else {
// //         this.validationErrorService.handleApiErrors(
// //           this.form,
// //           error,
// //           this.backendErrorKeyMap,
// //           this.apiFieldErrors
// //         );
// //       }
// //     });

// //     effect(() => {
// //       const success = this.store.scheduleSuccess();
// //       console.log('success effect',success);

// //       if (success)
// //        {
// //         console.log('success');
// //         this.cancel();
// //         this.store.setScheduleSuccess(false);
// //        }
// //     });
// //   }

// //   onSubmit(){
// //     console.log(this.form.invalid);
// //     if (this.form.invalid) {
// //       this.form.markAllAsTouched();
// //       return;
// //     }
// //     if (this.form.valid) {
// //       this.createDoctotSchedule();}

// //   }
// //   createDoctotSchedule(){
// //     this.store.addDoctorSchedule(this.getPayload());
// //   }


// //   getPayload() {
// //     const v = this.form.getRawValue();

// //     const to24Hour = (time12h: string | null): string => {
// //       if (!time12h) return '00:00:00'; // handles null or empty string
// //       const parts = time12h.split(' ');
// //       if (parts.length !== 2) return '00:00:00';

// //       const [time, modifier] = parts;
// //       const [hoursStr, minutesStr] = time.split(':');
// //       if (!hoursStr || !minutesStr) return '00:00:00';

// //       let hours = Number(hoursStr);
// //       const minutes = Number(minutesStr);

// //       if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
// //       if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

// //       return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
// //     };

// //     const payload: DoctorSchedule = {
// //       doctorId: v.doctorId!,
// //       dayOfWeekId: v.dayOfWeekId!,
// //       startTime: to24Hour(v.startTime),
// //       endTime: to24Hour(v.endTime),
// //       slotDurationMinutes: v.slotDurationMinutes!
// //     };

// //     console.log('payload', payload);

// //     return payload;
// //   }
// //     cancel() {
// //       console.log('in schedule cancel');
// //       this.form.markAsUntouched();
// //       this.form.reset();
// //       this.cancalEvent.emit();
// //     }
// // }


// import {
//   Component,
//   effect,
//   EventEmitter,
//   inject,
//   input,
//   Output
// } from '@angular/core';

// import {
//   FormArray,
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators
// } from '@angular/forms';

// import { AsyncPipe, NgClass, NgFor } from '@angular/common';
// import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
// import { LookupService } from 'src/app/common/service/lookup.service';
// import { DoctorStore } from '../../doctorStore/doctorStore';
// import { ValidationErrorService } from 'src/app/common/service/validation-error.service';
// import { ButtonComponent } from 'src/app/common/button/button.component';
// import { APIDoctorSchedule, DoctorSchedule, DoctorScheduleBulk } from '../../models/doctor-schedule';
// import { timeRangeValidator } from 'src/app/common/validators/time.range.validator';
// import { SharedService } from 'src/app/shared/services/shared.service';

// @Component({
//   selector: 'app-doctor-schedule-form',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     SpkNgSelectComponent,
//     NgClass,
//     AsyncPipe,
//     NgFor,
//     ButtonComponent
//   ],
//   templateUrl: './doctor-schedule-form.component.html',
//   styleUrl: './doctor-schedule-form.component.scss'
// })
// export class DoctorScheduleFormComponent {
//   // oid = input<string>('');
//   schedule = input<APIDoctorSchedule|null>(null);
//   new = input<boolean >(false);

//   @Output() cancalEvent = new EventEmitter<void>();

//   private fb = inject(FormBuilder);
//   private shared = inject(SharedService);

//   private lookupService = inject(LookupService);
//   private store = inject(DoctorStore);
//   validationErrorService = inject(ValidationErrorService);

//   doctors = this.store.doctors;

//   weekDays$ = this.lookupService.getDays();
//   workingHours$ = this.lookupService.getDayHours();
//   slotDurations$ = this.lookupService.getSlotDuration();

//   apiFieldErrors: Record<string, string> = {};

//   form = this.fb.group({
//     workingHours: this.fb.array([this.createWorkingHourGroup()])
//   });

//   constructor() {

//     this.form.valueChanges.subscribe(() => {
//       this.validateDuplicateDays();
//     });

//     effect(() => {
//       console.log('in scedule feff');
//       const schedule = this.schedule();
//       if (!schedule) return;

//       this.weekDays$.subscribe(days => {
//         const lookupDays = days?.lookupDetails ?? [];
//         const day = lookupDays.find(
//           d => d.valueNameEn === schedule.dayOfWeekNameEn
//         );

//         const dayId = day?.oid ?? null;
//         this.workingHours.clear();

//         this.workingHours.push(
//           this.fb.group({
//             doctorId: schedule.doctorId,
//             dayOfWeekId: dayId,
//             startTime: schedule.startTime,
//             endTime: schedule.endTime,
//             slotDurationMinutes: schedule.slotDurationMinutes
//           })
//         );
//       });

//     });

//     effect(() => {

//       console.log('in new effect');

//       const newSchedule = this.new();
//       if (!newSchedule) return;
//      console.log('in new');
//       this.workingHours.clear();

//       this.workingHours.push(
//         this.fb.group({
//           doctorId: this.store.selectedDoctor()?.oid,
//           dayOfWeekId: null,
//           startTime: null,
//           endTime: null,
//           slotDurationMinutes: null
//         })
//       );

//     });


//     effect(() => {
//       const error = this.store.error();

//       if (!error) {
//         this.validationErrorService.clearErrors(this.form, this.apiFieldErrors);
//       } else {
//         this.validationErrorService.handleApiErrors(
//           this.form,
//           error,
//           {},
//           this.apiFieldErrors
//         );
//       }
//     });

//     effect(() => {
//       const success = this.store.scheduleSuccess();
//       if (success) {
//         this.cancel();
//         this.store.setScheduleSuccess(false);
//       }
//     });

//   }

//   get workingHours(): FormArray {
//     return this.form.get('workingHours') as FormArray;
//   }

//   createWorkingHourGroup(): FormGroup {
//     return this.fb.group(
//       {
//         doctorId: [null, Validators.required],
//         dayOfWeekId: [null, Validators.required],
//         startTime: [null, Validators.required],
//         endTime: [null, Validators.required],
//         slotDurationMinutes: [null, Validators.required],
//       },
//       { validators: timeRangeValidator }
//     );
//   }

//   addWorkingHour() {
//     this.workingHours.push(this.createWorkingHourGroup());
//     this.validateDuplicateDays();

//   }


//   removeWorkingHour(index: number) {
//     if (this.workingHours.length > 1) {
//       this.workingHours.removeAt(index);
//       this.validateDuplicateDays();
//     }
//   }

//   onSubmit() {
//     if (this.form.invalid) {

//       this.form.markAllAsTouched();
//       return;
//     }
//     if (this.schedule()) {
//       this.updateSchedule();
//     } else{
//       this.createSchedule();
//     }



//   }
//   createSchedule(){
//     // if(this.new())
//     //   this.createSingle();
//     // else this.createBulk()
//      this.createBulk();

//   }

//   createSingle(){
//     console.log('in createSingle');
//    const payload=this.getSinglePayload()
//     this.store.addDoctorSchedule(payload);
//   }


//   createBulk(){
//     const payload = this.getPayload();
//     this.store.addBulkDoctorSchedule(payload);
//   }

//   updateSchedule(){
//     const payload = this.getEditPayload();
//     this.store.updateDoctorSchedule({ id: payload.oid, body: payload });

//   }

//   validateDuplicateDays() {

//     const days = this.workingHours.controls.map(
//       c => c.get('dayOfWeekId')?.value
//     );

//     this.workingHours.controls.forEach(control => {
//       const dayControl = control.get('dayOfWeekId');

//       if (!dayControl) return;

//       const currentValue = dayControl.value;

//       const occurrences = days.filter(d => d === currentValue).length;

//       if (currentValue && occurrences > 1) {
//         dayControl.setErrors({
//           ...(dayControl.errors || {}),
//           duplicateDay: true
//         });
//       } else {
//         if (dayControl.errors?.['duplicateDay']) {
//           const { duplicateDay, ...rest } = dayControl.errors;
//           dayControl.setErrors(Object.keys(rest).length ? rest : null);
//         }
//       }

//     });

//   }

//   private buildSchedulePayload() {
//     const v = this.workingHours.at(0).getRawValue();

//     return {
//       doctorId: v.doctorId,
//       dayOfWeekId: v.dayOfWeekId,
//       startTime: this.shared.to24Hour(v.startTime),
//       endTime: this.shared.to24Hour(v.endTime),
//       slotDurationMinutes: Number(v.slotDurationMinutes),
//     };
//   }

//   getSinglePayload() {
//     return this.buildSchedulePayload();
//   }

//   getEditPayload(){
//     return {
//       oid: this.schedule()!.oid,
//       ...this.buildSchedulePayload()
//     };
//   }

//   getPayload(): DoctorScheduleBulk {

//     const values = this.form.getRawValue();

//     const doctorId = values.workingHours[0]?.['doctorId'];

//     return {
//       doctorId,
//       doctorSchedules: values.workingHours.map((v: any) => ({
//         startTime: this.shared.to24Hour(v.startTime),
//         endTime: this.shared.to24Hour(v.endTime),
//         slotDurationMinutes: Number(v.slotDurationMinutes),
//         dayOfWeekId: v.dayOfWeekId
//       }))
//     };

//   }

//   cancel() {
//     this.form.reset();
//     this.workingHours.clear();
//     this.addWorkingHour();
//     this.cancalEvent.emit();
//   }

// }


// import { Component, effect, EventEmitter, inject, input, Output, signal } from '@angular/core';
// import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
// import { LookupService } from 'src/app/common/service/lookup.service';
// import { AsyncPipe } from '@angular/common';
// import { DoctorStore } from '../../doctorStore/doctorStore';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ValidationErrorService } from 'src/app/common/service/validation-error.service';
// import { ButtonComponent } from 'src/app/common/button/button.component';
// import { DoctorSchedule } from '../../models/doctor-schedule';

// @Component({
//   selector: 'app-doctor-schedule-form',
//   imports: [SpkNgSelectComponent, AsyncPipe,ReactiveFormsModule,
//     ButtonComponent
//   ],
//   templateUrl: './doctor-schedule-form.component.html',
//   styleUrl: './doctor-schedule-form.component.scss'
// })
// export class DoctorScheduleFormComponent {
//   @Output() cancalEvent = new EventEmitter<any>();
//   private lookupService = inject(LookupService);
//   private store=inject(DoctorStore);
//   doctors = this.store.doctors;
//   weekDays$=this.lookupService.getDays();
//   workingHours$=this.lookupService.getDayHours();
//   slotDurations$ = this.lookupService.getSlotDuration();
//   fb = inject(FormBuilder);
//   id: string = '';
//   validationErrorService = inject(ValidationErrorService);
//   oid = input<string>('');

//   form = this.fb.group({

//     doctorId: [null, [Validators.required]],
//     dayOfWeekId: [null, [Validators.required]],
//     startTime: [null, [Validators.required]],
//     endTime: [null, [Validators.required]],
//     slotDurationMinutes: [null, [Validators.required]],

//   });

//   private backendErrorKeyMap: Record<string, string[]> = {
//     doctorId: ['doctorId'],
//     StartTime: ['startTime'],
//     EndTime: ['endTime'],
//   };
//   apiFieldErrors: Record<string, string> = {};

//   constructor(){
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
//       const success = this.store.scheduleSuccess();
//       console.log('success effect',success);

//       if (success)
//        {
//         console.log('success');
//         this.cancel();
//         this.store.setScheduleSuccess(false);
//        }
//     });
//   }

//   onSubmit(){
//     console.log(this.form.invalid);
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }
//     if (this.form.valid) {
//       this.createDoctotSchedule();}

//   }
//   createDoctotSchedule(){
//     this.store.addDoctorSchedule(this.getPayload());
//   }


//   getPayload() {
//     const v = this.form.getRawValue();

//     const to24Hour = (time12h: string | null): string => {
//       if (!time12h) return '00:00:00'; // handles null or empty string
//       const parts = time12h.split(' ');
//       if (parts.length !== 2) return '00:00:00';

//       const [time, modifier] = parts;
//       const [hoursStr, minutesStr] = time.split(':');
//       if (!hoursStr || !minutesStr) return '00:00:00';

//       let hours = Number(hoursStr);
//       const minutes = Number(minutesStr);

//       if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
//       if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

//       return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
//     };

//     const payload: DoctorSchedule = {
//       doctorId: v.doctorId!,
//       dayOfWeekId: v.dayOfWeekId!,
//       startTime: to24Hour(v.startTime),
//       endTime: to24Hour(v.endTime),
//       slotDurationMinutes: v.slotDurationMinutes!
//     };

//     console.log('payload', payload);

//     return payload;
//   }
//     cancel() {
//       console.log('in schedule cancel');
//       this.form.markAsUntouched();
//       this.form.reset();
//       this.cancalEvent.emit();
//     }
// }


import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
  signal
} from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AsyncPipe, KeyValuePipe, NgClass, NgFor } from '@angular/common';
import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
import { LookupService } from 'src/app/common/service/lookup.service';
import { DoctorStore } from '../../doctorStore/doctorStore';
import { ValidationErrorService } from 'src/app/common/service/validation-error.service';
import { ButtonComponent } from 'src/app/common/button/button.component';
import {  DoctorSchedule, DoctorScheduleBulk } from '../../models/doctor-schedule';
import { timeRangeValidator } from 'src/app/common/validators/time.range.validator';
import { SharedService } from 'src/app/shared/services/shared.service';
import { WorkingDayCardComponent } from './working-day-card/working-day-card.component';
import { BranchStore } from 'src/app/Hospital/Store/Branch/branch.store';
import { SpecialityStore } from 'src/app/Hospital/Store/Speciality/speciality.store';
import SpkFlatpickrComponent from 'src/app/common/spk-flatpickr/spk-flatpickr.component';

@Component({
  selector: 'app-doctor-schedule-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SpkNgSelectComponent,
    NgClass,
    AsyncPipe,
    NgFor,
    ButtonComponent,
    WorkingDayCardComponent,
    KeyValuePipe,
    SpkFlatpickrComponent
  ],
  templateUrl: './doctor-schedule-form.component.html',
  styleUrl: './doctor-schedule-form.component.scss',
})
export class DoctorScheduleFormComponent {
  // oid = input<string>('');
  editingSlotId = signal<string | null>(null);
  // schedule = input<APIDoctorSchedule | null>(null);
  new = input<boolean>(false);
  showTitle = input<boolean>(true);

  // selectedSchedules: any[] = [];
  selectedSchedules = signal<any[]>([]);
    @Output() cancalEvent = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private shared = inject(SharedService);
  private lookupService = inject(LookupService);
  private store = inject(DoctorStore);
  private branchStore = inject(BranchStore);
    specialityStore = inject(SpecialityStore);
    specialities=computed(()=> this.specialityStore.items())
  branches = computed(() => this.branchStore.items());
  validationErrorService = inject(ValidationErrorService);

  doctors = this.store.doctors;

  weekDays$ = this.lookupService.getDays();
  workingHours$ = this.lookupService.getDayHours();
  slotDurations$ = this.lookupService.getSlotDuration();
   clinicNumbers = [
    { oid: 1, name: 'Clinic 1' },
    { oid: 2, name: 'Clinic 2' },
    { oid: 3, name: 'Clinic 3' }
  ];

  apiFieldErrors: Record<string, string> = {};


  form = this.fb.group({
    doctorId: [null as string | null, Validators.required],
    statusId: [null as string | null, Validators.required],
    branchId: [null as string | null, Validators.required],
    specialityId: [null as string | null, Validators.required],
    clinicNumber:[null as string | null, Validators.required],
    dayOfWeekId: [[] as string[], Validators.required],
    startTime: [null as string | null, Validators.required],
    endTime: [null as string | null, Validators.required],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    slotDurationMinutes: [null as number | null, Validators.required],
    isPriority:[false],
    isActive:[false],
  });
  weekDaysSnapshot: any[] = [];

  // groupedSchedules = computed(() => {
  //   const groups: Record<string, any[]> = {};

  //   this.selectedSchedules().forEach(s => {
  //     if (!groups[s.dayOfWeekNameEn]) {
  //       groups[s.dayOfWeekNameEn] = [];
  //     }
  //     groups[s.dayOfWeekNameEn].push(s);
  //   });

  //   return groups;
  // });

  groupedSchedules = computed(() => {
    const groups: Record<string, any[]> = {};
    if(this.showTitle()){
      this.selectedSchedules().forEach(s => {
        if (!groups[s.dayOfWeekNameEn]) {
          groups[s.dayOfWeekNameEn] = [];
        }
        groups[s.dayOfWeekNameEn].push(s);
      });
    }

    return groups;
  });

  constructor() {

    this.weekDays$.subscribe(res => {
      this.weekDaysSnapshot = res?.lookupDetails ?? [];
    });


    // effect(() => {
    //   console.log('in scedule feff');
    //   const schedule = this.schedule();
    //   if (!schedule) return;

    //   // this.weekDays$.subscribe(days => {
    //   //   const lookupDays = days?.lookupDetails ?? [];
    //   //   const day = lookupDays.find(
    //   //     d => d.valueNameEn === schedule.dayOfWeekNameEn
    //   //   );

    //   //   const dayId = day?.oid ?? null;
    //   //   this.workingHours.clear();

    //   //   this.workingHours.push(
    //   //     this.fb.group({
    //   //       doctorId: schedule.doctorId,
    //   //       dayOfWeekId: dayId,
    //   //       startTime: schedule.startTime,
    //   //       endTime: schedule.endTime,
    //   //       slotDurationMinutes: schedule.slotDurationMinutes
    //   //     })
    //   //   );
    //   // });

    // });

    // effect(() => {

    //   console.log('in new effect');

    //   const newSchedule = this.new();
    //   if (!newSchedule) return;
    //   console.log('in new');
    //   // this.workingHours.clear();

    //   // this.workingHours.push(
    //   //   this.fb.group({
    //   //     doctorId: this.store.selectedDoctor()?.oid,
    //   //     dayOfWeekId: null,
    //   //     startTime: null,
    //   //     endTime: null,
    //   //     slotDurationMinutes: null
    //   //   })
    //   // );

    // });


    effect(() => {
      const error = this.store.error();

      if (!error) {
        this.validationErrorService.clearErrors(this.form, this.apiFieldErrors);
      } else {
        this.validationErrorService.handleApiErrors(
          this.form,
          error,
          {},
          this.apiFieldErrors
        );
      }
    });

    effect(() => {
      const success = this.store.scheduleSuccess();
      if (success) {
        this.cancel();
        this.store.setScheduleSuccess(false);
      }
    });

  }



  // addWorkingHour() {
  // console.log('addWorkingHouts');
  // }


  addSchedule() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const days = v.dayOfWeekId ?? [];

    const start = this.shared.to24Hour(v.startTime!);
    const end = this.shared.to24Hour(v.endTime!);

    days.forEach((dayId: string) => {

      const day = this.weekDaysSnapshot.find(d => d.oid === dayId);

      // duplicate slot
      const duplicate = this.selectedSchedules().some(s =>
        s.dayOfWeekId === dayId &&
        s.startTime === start &&
        s.endTime === end
      );

      if (duplicate) return;

      // overlap check
      const overlap = this.selectedSchedules().some(s =>
        s.dayOfWeekId === dayId &&
        start < s.endTime &&
        end > s.startTime
      );

      if (overlap) return;


      this.selectedSchedules.update(list => [
        ...list,
        {
          oid: crypto.randomUUID(),
          doctorId: v.doctorId!,
          dayOfWeekId: dayId,
          dayOfWeekNameEn: day?.valueNameEn ?? '',
          startTime: start,
          endTime: end,
          slotDurationMinutes: Number(v.slotDurationMinutes!)
        }
      ]);

    });

 this.form.reset();
if(!this.showTitle()){
   this.saveSchedule();
}
  }


  createSchedule() {
    this.createBulk();

  }

  saveSchedule() {
    if(this.selectedSchedules().length == 1)
      this.createSingle();
    else
    this.createBulk()
   }

  createSingle() {
    const payload = this.getSinglePayload()
    this.store.addDoctorSchedule(payload);
  }


  createBulk() {
    const payload = this.getPayload();
    this.store.addBulkDoctorSchedule(payload);
  }

  startEdit(slot: any) {
    if (slot)
      this.editingSlotId.set(slot.oid);
    else this.editingSlotId.set(null);

  }

  // updateSchedule(schedule:any) {
  //   const payload = this.getEditPayload(schedule);
  //   this.store.updateDoctorSchedule({ id: payload.oid, body: payload });

  // }
  editSchedule(schedule: any) {
    // if (!this.new()) {
    //   this.updateSchedule(schedule);
    // } else {
      this.selectedSchedules.update(list =>
        list.filter(s => s.oid !== schedule.oid)
      );
      this.selectedSchedules.update(list => [
        ...list,
        schedule
      ]);
    // }
  }

  // getEditPayload(schedule: any) {
  //   const { dayOfWeekNameEn, ...payload } = schedule;
  //   return payload;
  // }


  getPayload(): DoctorScheduleBulk {

    const schedules = this.selectedSchedules();

    return {
      doctorId: schedules[0]?.doctorId,
      statusId: schedules[0]?.statusId,
      branchId: schedules[0]?.branchId,
      specialtyId: schedules[0]?.specialtyId,
      isActive: schedules[0]?.isActive,
      isPriority: schedules[0]?.isPriority,
      startDate: this.shared.formatDateOnly(schedules[0]?.startDate),
      endDate: this.shared.formatDateOnly(schedules[0]?.endDate),
      doctorSchedulesList: schedules.map(s => ({
        startTime: s.startTime,
        endTime: s.endTime,
        slotDurationMinutes: Number(s.slotDurationMinutes),
        dayOfWeekId: s.dayOfWeekId
      }))
    };


  }

  private buildSchedulePayload(): DoctorSchedule {

    const schedule = this.selectedSchedules()[0];

    return {
      doctorId: schedule.doctorId,
      dayOfWeekId: schedule.dayOfWeekId,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      slotDurationMinutes: Number(schedule.slotDurationMinutes),
      isActive:true,
      isPriority:false,
      statusId: schedule.statusId,
      branchId: schedule.branchId,
      specialtyId: schedule.specialtyId,
      startDate: this.shared.formatDateOnly(schedule.startDate),
      endDate: this.shared.formatDateOnly(schedule.endDate),
    };

  }

  getSinglePayload() {
    return this.buildSchedulePayload();
  }


  deleteSchedule(schedule: any) {

    // if(!this.new()){

    //   this.store.deleteDoctorSchedule(schedule.oid);
    // }else{
      this.selectedSchedules.update(list =>
        list.filter(s => s.oid !== schedule.oid)
      );
    // }

  }

  cancel() {
    this.form.reset();
    // this.addWorkingHour();
    this.cancalEvent.emit();
  }
}
