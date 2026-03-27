import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
  untracked
} from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AsyncPipe, KeyValuePipe, NgClass, NgFor, NgIf } from '@angular/common';
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
import { timeRangeValidator } from 'src/app/common/validators/time.range.validator';
import { dateRangeValidator } from 'src/app/common/validators/date.range.validator';

@Component({
  selector: 'app-doctor-schedule-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SpkNgSelectComponent,
    NgClass,
    NgIf,
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



  // form = this.fb.group({
  //   doctorId: [null as string | null, Validators.required],
  //   statusId: [null as string | null, Validators.required],
  //   branchId: [null as string | null, Validators.required],
  //   specialityId: [null as string | null, Validators.required],
  //   clinicNumber: [null as string | null, Validators.required],
  //   dayOfWeekId: [[] as string[], Validators.required],
  //   startTime: [null as string | null, Validators.required],
  //   endTime: [null as string | null, Validators.required],
  //   startDate: ['', [Validators.required]],
  //   endDate: ['', [Validators.required]],
  //   slotDurationMinutes: [null as number | null, Validators.required],
  //   isActive: [null as string | null],
  //   isPriority: [null as string | null],
  // });
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
  }, {
    validators: [timeRangeValidator, dateRangeValidator]  });
  weekDaysSnapshot: any[] = [];



  groupedSchedules = computed(() => {
    const groups: Record<string, any[]> = {};

    const source = (this.oid())
      ? this.schedules()        // EDIT MODE
      : this.selectedSchedules(); // CREATE MODE

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

  doctorScheduleId=input<string>('');

  constructor() {

    this.form.get('startTime')?.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity();
    });

    this.form.get('endTime')?.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity();
    });

    this.form.get('startDate')?.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity();
    });

    this.form.get('endDate')?.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity();
    });
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
        this.markForm();
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

      this.markForm();
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
      const doctorOid = this.doctorScheduleId();

      if (!doctorOid) {
        this.selectedSchedules.set([]);
        this.form.reset();
        return;
      }

      // ✅ NOT tracked
      const doctor = untracked(() => this.store.selectedDoctor());

      if (doctor) {
        this.form.patchValue({
          doctorId: doctorOid,
          branchId: doctor.branchId,
          specialityId: doctor.specialtyId
        });

        this.markForm();
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
        if(!this.oid() ){
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

    this.markForm()
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

  markForm() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }


}
