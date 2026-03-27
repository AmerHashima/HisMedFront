// import {
//   Component,
//   computed,
//   effect,
//   EventEmitter,
//   inject,
//   input,
//   Output,
//   signal
// } from '@angular/core';

// import {
//   FormArray,
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators
// } from '@angular/forms';

// import { AsyncPipe, KeyValuePipe, NgClass, NgFor } from '@angular/common';
// import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
// import { LookupService } from 'src/app/common/service/lookup.service';
// import { DoctorStore } from '../../doctorStore/doctorStore';
// import { ValidationErrorService } from 'src/app/common/service/validation-error.service';
// import { ButtonComponent } from 'src/app/common/button/button.component';
// import { APIDoctorScheduleBulk, DoctorSchedule, DoctorScheduleBulk } from '../../models/doctor-schedule';
// import { SharedService } from 'src/app/shared/services/shared.service';
// import { WorkingDayCardComponent } from './working-day-card/working-day-card.component';
// import { BranchStore } from 'src/app/Hospital/Store/Branch/branch.store';
// import { SpecialityStore } from 'src/app/Hospital/Store/Speciality/speciality.store';
// import SpkFlatpickrComponent from 'src/app/common/spk-flatpickr/spk-flatpickr.component';
// import { DoctorVM } from '../../models/doctor-vm';

// @Component({
//   selector: 'app-doctor-schedule-form',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     SpkNgSelectComponent,
//     NgClass,
//     AsyncPipe,
//     NgFor,
//     ButtonComponent,
//     WorkingDayCardComponent,
//     KeyValuePipe,
//     SpkFlatpickrComponent
//   ],
//   templateUrl: './doctor-schedule-form.component.html',
//   styleUrl: './doctor-schedule-form.component.scss',
// })
// export class DoctorScheduleFormComponent {
//   oid = input<string>('');
//   doctor = input<DoctorVM | null>(null);
//   editingSchedule = signal<APIDoctorScheduleBulk | null>(null);
//   editingSlotId = signal<string | null>(null);
//   showTitle = input<boolean>(true);
//   selectedSchedules = signal<any[]>([]);
//   originalSchedules = signal<any[]>([]);
//   @Output() cancalEvent = new EventEmitter<void>();
//   private fb = inject(FormBuilder);
//   private shared = inject(SharedService);
//   private lookupService = inject(LookupService);
//   private store = inject(DoctorStore);
//   private branchStore = inject(BranchStore);
//   specialityStore = inject(SpecialityStore);
//   specialities = computed(() => this.specialityStore.items())
//  branches = computed(() => this.branchStore.items());
//  validationErrorService = inject(ValidationErrorService);
//  doctors = this.store.doctors;
//   weekDays$ = this.lookupService.getDays();
//   workingHours$ = this.lookupService.getDayHours();
//   slotDurations$ = this.lookupService.getSlotDuration();
//   scheduleStatus$ = this.lookupService.getScheduleStatus();
//   activeStatus$ = this.lookupService.getActiveStatus();
//   pirorityStatus$ = this.lookupService.getPirority();
//   // masterSchedule =this.store.selectedDoctorSchedules;

//   clinicNumbers = [
//     { oid: 1, name: 'Clinic 1' },
//     { oid: 2, name: 'Clinic 2' },
//     { oid: 3, name: 'Clinic 3' }
//   ];

//   apiFieldErrors: Record<string, string> = {};



//   form = this.fb.group({
//     doctorId: [null as string | null, Validators.required],
//     statusId: [null as string | null, Validators.required],
//     branchId: [null as string | null, Validators.required],
//     specialityId: [null as string | null, Validators.required],
//     clinicNumber: [null as string | null, Validators.required],
//     dayOfWeekId: [[] as string[], Validators.required],
//     startTime: [null as string | null, Validators.required],
//     endTime: [null as string | null, Validators.required],
//     startDate: ['', [Validators.required]],
//     endDate: ['', [Validators.required]],
//     slotDurationMinutes: [null as number | null, Validators.required],
//     isActive: [null as string | null],
//     isPriority: [null as string | null],
//   });
//   weekDaysSnapshot: any[] = [];



//   groupedSchedules = computed(() => {
//     const groups: Record<string, any[]> = {};
//     if (this.showTitle()) {
//       this.selectedSchedules().forEach(s => {
//         if (!groups[s.dayOfWeekNameEn]) {
//           groups[s.dayOfWeekNameEn] = [];
//         }
//         groups[s.dayOfWeekNameEn].push(s);
//       });
//     }
//    console.log('groups',groups);
//     return groups;
//   });

//   constructor() {



//     this.weekDays$.subscribe(res => {
//       this.weekDaysSnapshot = res?.lookupDetails ?? [];
//     });


//     effect(() => {
//       const oid = this.oid();
//       if (!oid) {
//         this.selectedSchedules.set([]);
//         this.form.reset();
//         return;
//       }
//       this.store.getDoctorSchedule(oid);
//     });


//     effect(() => {
//       const doctor = this.doctor();
//       console.log('doctor',doctor);
//       if (doctor){
//         this.form.patchValue({
//           doctorId: doctor.oid,
//           branchId: doctor.branchId ?? null,
//           specialityId: doctor.specialtyId  ?? null,
//           // statusId: null,
//           // clinicNumber: '1',
//           // isPriority: doctorSchedule.isPriority ? 'Yes' : 'No',
//           // isActive: doctorSchedule.isActive ? "Active" : "Inactive",
//           // endDate: doctorSchedule.endDate,
//           // startDate: doctorSchedule.startDate,
//         });
//       }
//     });

//     effect(() => {
//       const doctorSchedule = this.store.selectedDoctorSchedule();
//       const oid = this.oid();

//       if (!doctorSchedule || !oid) return;
//  console.log('in here');
//       if (doctorSchedule) {
//         this.editingSchedule.set(doctorSchedule);
//         this.form.patchValue({
//           doctorId: doctorSchedule.doctorId,
//           // statusId: doctorSchedule.statusId ?? null,
//           // branchId: doctorSchedule.branchId ?? null,
//           // specialityId: doctorSchedule.specialityId  ?? null,
//           statusId: null,
//           branchId: null,
//           specialityId: null,
//           clinicNumber: '1',
//           isPriority: doctorSchedule.isPriority ? 'Yes' : 'No',
//           isActive: doctorSchedule.isActive ? "Active":"Inactive",
//           endDate: doctorSchedule.endDate,
//           startDate: doctorSchedule.startDate,
//           dayOfWeekId: [],
//           startTime: null,
//           endTime: null,
//           slotDurationMinutes: null,
//         });

//         const mappedSchedule = doctorSchedule.details.map((detail: any) => ({
//           oid: detail.oid,
//           isLocal: false,
//           doctorId: doctorSchedule.doctorId!,
//           // specialtyId: doctorSchedule.specialityId!,
//           // branchId: doctorSchedule.branchId!,
//           // statusId: doctorSchedule.statusId!,
//           specialtyId: null,
//           branchId: null,
//           statusId: null,
//           dayOfWeekId: detail.dayOfWeekId,
//           dayOfWeekNameEn: detail.dayOfWeekNameEn,
//           startTime: detail.startTime,
//           startDate: doctorSchedule.startDate,
//           endDate: doctorSchedule.endDate,
//           endTime: detail.endTime,
//           isActive: doctorSchedule.isActive,
//           isPriority: doctorSchedule.isPriority,
//           slotDurationMinutes: Number(detail.slotDurationMinutes!)
//         }))

//         // this.selectedSchedules.set(mappedSchedule);
//         this.originalSchedules.set(mappedSchedule);
//         this.selectedSchedules.set(structuredClone(mappedSchedule));
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
//           {},
//           this.apiFieldErrors
//         );
//       }
//     });


//     effect(() => {
//       const success = this.store.scheduleSuccess();
//       if (success) {

//         if (this.oid()) {
//           this.store.getDoctorSchedule(this.oid());
//         }else{
//           this.cancel();
//         }
//         this.store.setScheduleSuccess(false);
//       }
//     });

//     // effect(() => {
//     //   const success = this.store.scheduleSuccess();
//     //   if (success) {
//     //     this.cancel();
//     //     this.store.setScheduleSuccess(false);
//     //   }
//     // });

//   }


//   logFormIssues() {
//     const controls = this.form.controls;

//     console.log('🚨 FORM INVALID — DETAILS BELOW:\n');

//     (Object.keys(controls) as (keyof typeof controls)[]).forEach(key => {
//       const control = controls[key];

//       if (control.invalid) {
//         const value = control.value;
//         const errors = control.errors;

//         let reasons: string[] = [];

//         if (errors) {
//           if (errors['required']) reasons.push('Required field is missing');
//           if (errors['email']) reasons.push('Invalid email format');
//           if (errors['min']) reasons.push(`Value is less than minimum (${errors['min'].min})`);
//           if (errors['max']) reasons.push(`Value exceeds maximum (${errors['max'].max})`);
//           if (errors['minlength']) reasons.push(`Too short (min ${errors['minlength'].requiredLength})`);
//           if (errors['maxlength']) reasons.push(`Too long (max ${errors['maxlength'].requiredLength})`);
//         }

//         console.log(`❌ FIELD: ${String(key)}`);
//         console.log(`   Value:`, value);
//         console.log(`   Problem: ${reasons.join(' | ') || 'Unknown error'}`);
//         console.log('----------------------------');
//       }
//     });
//   }

//   addSchedule() {

//     if (this.form.invalid) {
//       this.logFormIssues();
//       console.log('invalid');
//       this.form.markAllAsTouched();
//       return;
//     }

//     const v = this.form.getRawValue();

//     // if (this.oid()) {
//     //   this.selectedSchedules.update(list =>
//     //     list.map(item => ({
//     //       ...item,
//     //       doctorId: v.doctorId!,
//     //       specialtyId: v.specialityId!,
//     //       branchId: v.branchId!,
//     //       statusId: v.statusId!,
//     //       clinicNumber: v.clinicNumber,
//     //       startDate: v.startDate,
//     //       endDate: v.endDate,
//     //     }))
//     //   );
//     // }

//     const days = v.dayOfWeekId ?? [];

//     const start = this.shared.to24Hour(v.startTime!);
//     const end = this.shared.to24Hour(v.endTime!);

//     days.forEach((dayId: string) => {

//       const day = this.weekDaysSnapshot.find(d => d.oid === dayId);

//       // duplicate slot
//       const duplicate = this.selectedSchedules().some(s =>
//         s.dayOfWeekId === dayId &&
//         s.startTime === start &&
//         s.endTime === end
//       );

//       if (duplicate) return;

//       // overlap check
//       const overlap = this.selectedSchedules().some(s =>
//         s.dayOfWeekId === dayId &&
//         start < s.endTime &&
//         end > s.startTime
//       );

//       if (overlap) return;


//       this.selectedSchedules.update(list => [
//         ...list,
//         {
//           oid: crypto.randomUUID(),
//           doctorId: v.doctorId!,
//           specialtyId: v.specialityId!,
//           branchId: v.branchId!,
//           statusId: v.statusId!,
//           dayOfWeekId: dayId,
//           dayOfWeekNameEn: day?.valueNameEn ?? '',
//           startTime: start,
//           isLocal: true,
//           startDate: v.startDate,
//           endDate: v.endDate,
//           endTime: end,
//           isActive: v.isActive === 'Active',
//           isPriority: v.isPriority === 'Yes',
//           // isActive: v.isActive,
//           // isPriority: v.isPriority,
//           slotDurationMinutes: Number(v.slotDurationMinutes!)
//         }
//       ]);
//     });

//     //  this.form.reset();

//     this.form.patchValue({
//       dayOfWeekId: [],
//       startTime: null,
//       endTime: null,
//       slotDurationMinutes: null
//     });

//     // mark only these controls as untouched + pristine
//     ['dayOfWeekId', 'startTime', 'endTime', 'slotDurationMinutes']
//       .forEach(field => {
//         const control = this.form.get(field);
//         control?.markAsUntouched();
//         control?.markAsPristine();
//       });

//     if (!this.showTitle()) {
//       this.createBulk();
//     }
//   }


//   createSchedule() {
//     this.createBulk();

//   }

//   saveSchedule() {
//     if (this.oid())
//       this.updateMasterSchedule()
//     else
//       this.createSchedule();
//   }

//   // createSingle() {
//   //   const payload = this.getSinglePayload()
//   //   this.store.addDoctorSchedule(payload);
//   // }


//   createBulk() {
//     const payload = this.getPayload();
//     this.store.addBulkDoctorSchedule(payload);
//   }

//   // updateMasterSchedule() {
//   //   const schedules = this.selectedSchedules();
//   //   const newDetails = schedules
//   //     .filter(s => s.isLocal)
//   //     .map(s => ({
//   //       masterId: this.oid(),
//   //       dayOfWeekId: s.dayOfWeekId,
//   //       startTime: s.startTime,
//   //       endTime: s.endTime,
//   //       slotDurationMinutes: Number(s.slotDurationMinutes)
//   //     }));

//   //   const masterPayload = {
//   //     id: this.oid(),
//   //     body: this.getEditMasterSchedulePayload()
//   //   };

//   //   this.store.updateDoctorScheduleWithDetails({
//   //     master: masterPayload,
//   //     newDetails
//   //   });
//   // }

//   updateMasterSchedule() {
//     const schedules = this.selectedSchedules();
//     const original = this.originalSchedules();

//     const newDetails = schedules
//       .filter(s => s.isLocal)
//       .map(s => ({
//         masterId: this.oid(),
//         dayOfWeekId: s.dayOfWeekId,
//         startTime: s.startTime,
//         endTime: s.endTime,
//         slotDurationMinutes: Number(s.slotDurationMinutes)
//       }));

//     const updatedDetails = schedules
//       .filter(s => !s.isLocal)
//       .filter(s => {
//         const orig = original.find(o => o.oid === s.oid);
//         if (!orig) return false;

//         return (
//           orig.startTime !== s.startTime ||
//           orig.endTime !== s.endTime ||
//           orig.dayOfWeekId !== s.dayOfWeekId ||
//           orig.slotDurationMinutes !== s.slotDurationMinutes
//         );
//       })
//       .map(s => ({
//         oid: s.oid,
//         masterId: this.oid(),
//         dayOfWeekId: s.dayOfWeekId,
//         startTime: s.startTime,
//         endTime: s.endTime,
//         slotDurationMinutes: Number(s.slotDurationMinutes)
//       }));

//     const deletedDetails = original
//       .filter(o => !schedules.some(s => s.oid === o.oid))
//       .map(o => o.oid);

//     const masterPayload = {
//       id: this.oid(),
//       body: this.getEditMasterSchedulePayload()
//     };

//     this.store.updateDoctorScheduleFull({
//       master: masterPayload,
//       newDetails,
//       updatedDetails,
//       deletedDetails
//     });
//   }

//   getEditMasterSchedulePayload() {
//     const v = this.form.getRawValue();
//     if (
//       !v.doctorId ||
//       !v.statusId ||
//       !v.branchId ||
//       !v.specialityId ||
//       !v.startDate ||
//       !v.endDate
//     ) {
//       throw new Error('Form is invalid');
//     }
//     return {
//       oid: this.oid(),
//       doctorId: v.doctorId,
//       statusId: v.statusId,
//       branchId: v.branchId,
//       specialtyId: v.specialityId,
//       isActive: v.isActive === 'Active',
//       isPriority: v.isPriority === 'Yes',
//       startDate: this.shared.formatDateOnly(v.startDate),
//       endDate: this.shared.formatDateOnly(v.endDate),
//     };
//   }

//   // getEditMasterSchedulePayload() {
//   //   const schedules = this.selectedSchedules();
//   //   return {
//   //     oid: this.oid(),
//   //     doctorId: schedules[0]?.doctorId,
//   //     statusId: schedules[0]?.statusId,
//   //     branchId: schedules[0]?.branchId,
//   //     specialtyId: schedules[0]?.specialtyId,
//   //     isActive: schedules[0]?.isActive,
//   //     isPriority: schedules[0]?.isPriority,
//   //     startDate: this.shared.formatDateOnly(schedules[0]?.startDate),
//   //     endDate: this.shared.formatDateOnly(schedules[0]?.endDate),
//   //   };
//   // }

//   startEdit(slot: any) {
//     if (slot)
//       this.editingSlotId.set(slot.oid);
//     else this.editingSlotId.set(null);

//   }
//   // editSchedule(schedule: any) {
//   //   if (this.oid() && !schedule.isLocal) {
//   //     const payload = this.getEditDetailPayload(schedule);
//   //     this.store.updateDetailDoctorSchedule({ id: schedule.oid, body: payload });
//   //   }
//   //   else {
//   //     this.selectedSchedules.update(list =>
//   //       list.filter(s => s.oid !== schedule.oid)
//   //     );
//   //     this.selectedSchedules.update(list => [
//   //       ...list,
//   //       schedule
//   //     ]);
//   //   }
//   // }

//   editSchedule(schedule: any) {
//     this.selectedSchedules.update(list =>
//       list.map(s => s.oid === schedule.oid ? { ...schedule } : s)
//     );
//   }

//   getEditDetailPayload(schedule: any) {
//     return {
//       oid: schedule.oid,
//       masterId: this.oid(),
//       dayOfWeekId: schedule.dayOfWeekId,
//       startTime: schedule.startTime,
//       endTime: schedule.endTime,
//       slotDurationMinutes: schedule.slotDurationMinutes
//     }
//   }

//   // getPayload(): DoctorScheduleBulk {

//   //   const schedules = this.selectedSchedules();
//   //   return {
//   //     doctorId: schedules[0]?.doctorId,
//   //     statusId: schedules[0]?.statusId,
//   //     branchId: schedules[0]?.branchId,
//   //     specialtyId: schedules[0]?.specialtyId,
//   //     isActive: schedules[0]?.isActive,
//   //     isPriority: schedules[0]?.isPriority,
//   //     startDate: this.shared.formatDateOnly(schedules[0]?.startDate),
//   //     endDate: this.shared.formatDateOnly(schedules[0]?.endDate),
//   //     doctorScheduleDetailList: schedules.map(s => ({
//   //       startTime: s.startTime,
//   //       endTime: s.endTime,
//   //       slotDurationMinutes: Number(s.slotDurationMinutes),
//   //       dayOfWeekId: s.dayOfWeekId
//   //     }))
//   //   };


//   // }

//   // private buildSchedulePayload(): DoctorSchedule {

//   //   const schedule = this.selectedSchedules()[0];

//   //   return {
//   //     doctorId: schedule.doctorId,
//   //     statusId: schedule.statusId,
//   //     branchId: schedule.branchId,
//   //     specialtyId: schedule.specialtyId,
//   //     dayOfWeekId: schedule.dayOfWeekId,
//   //     startTime: schedule.startTime,
//   //     endTime: schedule.endTime,
//   //     slotDurationMinutes: Number(schedule.slotDurationMinutes),
//   //     isActive: true,
//   //     isPriority: false,
//   //     startDate: this.shared.formatDateOnly(schedule.startDate),
//   //     endDate: this.shared.formatDateOnly(schedule.endDate),
//   //   };

//   // }

//   // getSinglePayload() {
//   //   return this.buildSchedulePayload();
//   // }


//   // deleteSchedule(schedule: any) {
//   //   if (this.oid() && !schedule.isLocal) {
//   //     this.store.deleteDetailDoctorSchedule(schedule.oid);
//   //   } else
//   //     this.selectedSchedules.update(list =>
//   //       list.filter(s => s.oid !== schedule.oid)
//   //     );
//   // }

//   getPayload(): DoctorScheduleBulk {
//     const v = this.form.getRawValue();
//     const schedules = this.selectedSchedules();

//     return {
//       doctorId: v.doctorId!,
//       statusId: v.statusId!,
//       branchId: v.branchId!,
//       specialtyId: v.specialityId!,
//       isActive: v.isActive === 'Active',
//       isPriority: v.isPriority === 'Yes',
//       startDate: this.shared.formatDateOnly(v.startDate!),
//       endDate: this.shared.formatDateOnly(v.endDate!),

//       doctorScheduleDetailList: schedules.map(s => ({
//         startTime: s.startTime,
//         endTime: s.endTime,
//         slotDurationMinutes: Number(s.slotDurationMinutes),
//         dayOfWeekId: s.dayOfWeekId
//       }))
//     };
//   }

//   deleteSchedule(schedule: any) {
//     this.selectedSchedules.update(list =>
//       list.filter(s => s.oid !== schedule.oid)
//     );
//   }

//   cancel() {
//     this.form.reset();
//     this.selectedSchedules.set([]);
//     this.cancalEvent.emit();
//   }
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
import { APIDoctorScheduleBulk, DoctorSchedule, DoctorScheduleBulk } from '../../models/doctor-schedule';
import { SharedService } from 'src/app/shared/services/shared.service';
import { WorkingDayCardComponent } from './working-day-card/working-day-card.component';
import { BranchStore } from 'src/app/Hospital/Store/Branch/branch.store';
import { SpecialityStore } from 'src/app/Hospital/Store/Speciality/speciality.store';
import SpkFlatpickrComponent from 'src/app/common/spk-flatpickr/spk-flatpickr.component';
import { DoctorVM } from '../../models/doctor-vm';

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
  oid = input<string>('');
  doctor = input<DoctorVM | null>(null);
  editingSchedule = signal<APIDoctorScheduleBulk | null>(null);
  editingSlotId = signal<string | null>(null);
  showTitle = input<boolean>(true);
  selectedSchedules = signal<any[]>([]);
  originalSchedules = signal<any[]>([]);
  @Output() cancalEvent = new EventEmitter<void>();
  private fb = inject(FormBuilder);
  private shared = inject(SharedService);
  private lookupService = inject(LookupService);
  private store = inject(DoctorStore);
  private branchStore = inject(BranchStore);
  specialityStore = inject(SpecialityStore);
  specialities = computed(() => this.specialityStore.items())
  branches = computed(() => this.branchStore.items());
  validationErrorService = inject(ValidationErrorService);
  doctors = this.store.doctors;
  weekDays$ = this.lookupService.getDays();
  workingHours$ = this.lookupService.getDayHours();
  slotDurations$ = this.lookupService.getSlotDuration();
  scheduleStatus$ = this.lookupService.getScheduleStatus();
  activeStatus$ = this.lookupService.getActiveStatus();
  pirorityStatus$ = this.lookupService.getPirority();

  schedules = computed(() => {
    const schedules = this.store.selectedDoctorSchedule()?.details ?? [];
    console.log('apu schedukes',schedules);
    return schedules;
  });

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
    clinicNumber: [null as string | null, Validators.required],
    dayOfWeekId: [[] as string[], Validators.required],
    startTime: [null as string | null, Validators.required],
    endTime: [null as string | null, Validators.required],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    slotDurationMinutes: [null as number | null, Validators.required],
    isActive: [null as string | null],
    isPriority: [null as string | null],
  });
  weekDaysSnapshot: any[] = [];



  // groupedSchedules = computed(() => {
  //   const groups: Record<string, any[]> = {};
  //   if (this.showTitle()) {
  //     this.selectedSchedules().forEach(s => {
  //       if (!groups[s.dayOfWeekNameEn]) {
  //         groups[s.dayOfWeekNameEn] = [];
  //       }
  //       groups[s.dayOfWeekNameEn].push(s);
  //     });
  //   }
  //   console.log('groups', groups);
  //   return groups;
  // });

  groupedSchedules = computed(() => {
    const groups: Record<string, any[]> = {};

    const source = (this.oid())
      ? this.schedules()        // ✅ EDIT MODE
      : this.selectedSchedules(); // ✅ CREATE MODE

    if (this.showTitle()) {
      source.forEach(s => {
        const key = s.dayOfWeekNameEn || 'Unknown';

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


    effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.selectedSchedules.set([]);
        this.form.reset();
        return;
      }
      this.store.getDoctorSchedule(oid);
    });


    effect(() => {
      const doctor = this.doctor();
      console.log('doctor', doctor);
      if (doctor) {
        this.form.patchValue({
          doctorId: doctor.oid,
          branchId: doctor.branchId ?? null,
          specialityId: doctor.specialtyId ?? null,
          // statusId: null,
          // clinicNumber: '1',
          // isPriority: doctorSchedule.isPriority ? 'Yes' : 'No',
          // isActive: doctorSchedule.isActive ? "Active" : "Inactive",
          // endDate: doctorSchedule.endDate,
          // startDate: doctorSchedule.startDate,
        });
        this.form.markAsPristine();
        this.form.markAsUntouched();
      }
    });

    effect(() => {
      const doctorSchedule = this.store.selectedDoctorSchedule();
      const oid = this.oid();

      if (!doctorSchedule || !oid) return;
      if (this.editingSchedule()?.oid === doctorSchedule.oid) return;
      console.log('in here');
      if (doctorSchedule) {
        this.editingSchedule.set(doctorSchedule);
        this.form.patchValue({
          doctorId: doctorSchedule.doctorId,
          // statusId: doctorSchedule.statusId ?? null,
          // branchId: doctorSchedule.branchId ?? null,
          // specialityId: doctorSchedule.specialityId  ?? null,
          statusId: null,
          branchId: null,
          specialityId: null,
          clinicNumber: '1',
          isPriority: doctorSchedule.isPriority ? 'Yes' : 'No',
          isActive: doctorSchedule.isActive ? "Active" : "Inactive",
          endDate: doctorSchedule.endDate,
          startDate: doctorSchedule.startDate,
          dayOfWeekId: [],
          startTime: null,
          endTime: null,
          slotDurationMinutes: null,
        });

        this.form.markAsPristine();
        this.form.markAsUntouched();
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
          {},
          this.apiFieldErrors
        );
      }
    });


    effect(() => {
      const success = this.store.scheduleSuccess();
      if (success) {
        // if (this.oid()) {
        //   this.store.getDoctorSchedule(this.oid());
        // } else {
        //   this.cancel();
        // }
        if(!this.oid()){
          this.cancel();
        }
        this.store.setScheduleSuccess(false);
      }
    });

  }


  logFormIssues() {
    const controls = this.form.controls;

    console.log('🚨 FORM INVALID — DETAILS BELOW:\n');

    (Object.keys(controls) as (keyof typeof controls)[]).forEach(key => {
      const control = controls[key];

      if (control.invalid) {
        const value = control.value;
        const errors = control.errors;

        let reasons: string[] = [];

        if (errors) {
          if (errors['required']) reasons.push('Required field is missing');
          if (errors['email']) reasons.push('Invalid email format');
          if (errors['min']) reasons.push(`Value is less than minimum (${errors['min'].min})`);
          if (errors['max']) reasons.push(`Value exceeds maximum (${errors['max'].max})`);
          if (errors['minlength']) reasons.push(`Too short (min ${errors['minlength'].requiredLength})`);
          if (errors['maxlength']) reasons.push(`Too long (max ${errors['maxlength'].requiredLength})`);
        }

        console.log(`❌ FIELD: ${String(key)}`);
        console.log(`   Value:`, value);
        console.log(`   Problem: ${reasons.join(' | ') || 'Unknown error'}`);
        console.log('----------------------------');
      }
    });
  }

  private isDetailFormInvalid(): boolean {
    const detailFields = [
      'dayOfWeekId',
      'startTime',
      'endTime',
      'slotDurationMinutes'
    ];

    return detailFields.some(field => this.form.get(field)?.invalid);
  }

  private isFullFormInvalid(): boolean {
    return this.form.invalid;
  }
  
  addSchedule() {
    // if (this.form.invalid) {
    //   this.logFormIssues();
    //   this.form.markAllAsTouched();
    //   return;
    // }

    if (this.oid()) {
      // ✅ EDIT → validate ONLY details
      if (this.isDetailFormInvalid()) {
        ['dayOfWeekId', 'startTime', 'endTime', 'slotDurationMinutes']
          .forEach(f => this.form.get(f)?.markAsTouched());
        return;
      }
    } else {
      // ✅ CREATE → validate FULL form
      if (this.isFullFormInvalid()) {
        this.logFormIssues();
        this.form.markAllAsTouched();
        return;
      }
    }

    const v = this.form.getRawValue();
    const days = v.dayOfWeekId ?? [];
    const start = this.shared.to24Hour(v.startTime!);
    const end = this.shared.to24Hour(v.endTime!);

    // 🔥 source depends on mode
    const source = (this.oid())
      ? this.schedules() // EDIT MODE (store)
      : this.selectedSchedules(); // CREATE MODE (local)

      console.log('source',source);
    // 🔥 VALID days to send
    const validDays: string[] = [];

    days.forEach((dayId: string) => {

      // ✅ duplicate check
      const duplicate = source.some(s =>
        s.dayOfWeekId === dayId &&
        s.startTime === start &&
        s.endTime === end
      );

      if (duplicate) return;

      // ✅ overlap check
      const overlap = source.some(s =>
        s.dayOfWeekId === dayId &&
        start < s.endTime &&
        end > s.startTime
      );

      if (overlap) return;

      validDays.push(dayId);
    });

    // 🚨 nothing valid
    console.log('validDays', validDays);
    console.log('OID', this.oid());

    if (!validDays.length) {
      console.warn('No valid slots to add');
      return;
    }


    // 🔥 ===== EDIT MODE (API ONCE) =====
    if ((this.oid())) {
      const payloads = validDays.map(dayId => ({
        masterId: this.oid(),
        dayOfWeekId: dayId,
        startTime: start,
        endTime: end,
        slotDurationMinutes: Number(v.slotDurationMinutes!)
      }));

      this.store.addDetailDoctorSchedulesBulk(payloads);
    }

    // 🔥 ===== CREATE MODE (LOCAL) =====
    else {
      validDays.forEach(dayId => {
        const day = this.weekDaysSnapshot.find(d => d.oid === dayId);

        this.selectedSchedules.update(list => [
          ...list,
          {
            oid: crypto.randomUUID(),
            doctorId: v.doctorId!,
            specialtyId: v.specialityId!,
            branchId: v.branchId!,
            statusId: v.statusId!,
            dayOfWeekId: dayId,
            dayOfWeekNameEn: day?.valueNameEn ?? '',
            startTime: start,
            endTime: end,
            slotDurationMinutes: Number(v.slotDurationMinutes!)
          }
        ]);
      });
    }

    // 🔥 reset ONLY time inputs
    this.form.patchValue({
      dayOfWeekId: [],
      startTime: null,
      endTime: null,
      slotDurationMinutes: null
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }


  createSchedule() {
    this.createBulk();

  }

  saveSchedule() {
    if ((this.oid())) {
      this.store.updateDoctorSchedule({
        id: this.oid(),
        body: this.getEditMasterSchedulePayload()
      });
    } else {
      this.createSchedule();
    }
  }






  createBulk() {
    const payload = this.getPayload();
    this.store.addBulkDoctorSchedule(payload);
  }



  getEditMasterSchedulePayload() {
    const v = this.form.getRawValue();
    if (
      !v.doctorId ||
      !v.statusId ||
      !v.branchId ||
      !v.specialityId ||
      !v.startDate ||
      !v.endDate
    ) {
      throw new Error('Form is invalid');
    }
    return {
      oid: this.oid(),
      doctorId: v.doctorId,
      statusId: v.statusId,
      branchId: v.branchId,
      specialtyId: v.specialityId,
      isActive: v.isActive === 'Active',
      isPriority: v.isPriority === 'Yes',
      startDate: this.shared.formatDateOnly(v.startDate),
      endDate: this.shared.formatDateOnly(v.endDate),
    };
  }


  startEdit(slot: any) {
    if (slot)
      this.editingSlotId.set(slot.oid);
    else this.editingSlotId.set(null);

  }

  editSchedule(schedule: any) {

    if (this.oid()) {
      // ✅ EDIT MODE → API
      this.store.updateDetailDoctorSchedule({
        id: schedule.oid,
        body: this.getEditDetailPayload(schedule)
      });
    } else {
      // ✅ CREATE MODE → LOCAL
      this.selectedSchedules.update(list =>
        list.map(s => s.oid === schedule.oid ? { ...schedule } : s)
      );
    }
  }

  getEditDetailPayload(schedule: any) {
    return {
      oid: schedule.oid,
      masterId: this.oid(),
      dayOfWeekId: schedule.dayOfWeekId,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      slotDurationMinutes: schedule.slotDurationMinutes
    }
  }



  getPayload(): DoctorScheduleBulk {
    const v = this.form.getRawValue();
    const schedules = this.selectedSchedules();

    return {
      doctorId: v.doctorId!,
      statusId: v.statusId!,
      branchId: v.branchId!,
      specialtyId: v.specialityId!,
      isActive: v.isActive === 'Active',
      isPriority: v.isPriority === 'Yes',
      startDate: this.shared.formatDateOnly(v.startDate!),
      endDate: this.shared.formatDateOnly(v.endDate!),

      doctorScheduleDetailList: schedules.map(s => ({
        startTime: s.startTime,
        endTime: s.endTime,
        slotDurationMinutes: Number(s.slotDurationMinutes),
        dayOfWeekId: s.dayOfWeekId
      }))
    };
  }

  deleteSchedule(schedule: any) {

    if (this.oid()) {
      // ✅ EDIT MODE → API
      this.store.deleteDetailDoctorSchedule(schedule.oid);
    } else {
      // ✅ CREATE MODE → LOCAL
      this.selectedSchedules.update(list =>
        list.filter(s => s.oid !== schedule.oid)
      );
    }
  }

  cancel() {
    this.form.reset();
    this.selectedSchedules.set([]);
    this.cancalEvent.emit();
  }
}
