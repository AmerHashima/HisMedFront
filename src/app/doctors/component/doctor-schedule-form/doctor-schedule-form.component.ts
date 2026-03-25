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
  editingSchedule = signal<APIDoctorScheduleBulk | null>(null)
  editingSlotId = signal<string | null>(null);
  doctor = input<DoctorVM | null>(null);
  showTitle = input<boolean>(true);
  selectedSchedules = signal<any[]>([]);
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



  groupedSchedules = computed(() => {
    const groups: Record<string, any[]> = {};
    if (this.showTitle()) {
      this.selectedSchedules().forEach(s => {
        if (!groups[s.dayOfWeekNameEn]) {
          groups[s.dayOfWeekNameEn] = [];
        }
        groups[s.dayOfWeekNameEn].push(s);
      });
    }
   console.log('groups',groups);
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
      const doctorSchedule = this.store.selectedDoctorSchedule();
      const oid = this.oid();

      if (!doctorSchedule || !oid) return;

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
          isActive: doctorSchedule.isActive ? "Active":"Inactive",
          endDate: doctorSchedule.endDate,
          startDate: doctorSchedule.startDate,
          dayOfWeekId: [],
          startTime: null,
          endTime: null,
          slotDurationMinutes: null,
        });

        const mappedSchedule = doctorSchedule.details.map((detail: any) => ({
          oid: detail.oid,
          isLocal: false,
          doctorId: doctorSchedule.doctorId!,
          // specialtyId: doctorSchedule.specialityId!,
          // branchId: doctorSchedule.branchId!,
          // statusId: doctorSchedule.statusId!,
          specialtyId: null,
          branchId: null,
          statusId: null,
          dayOfWeekId: detail.dayOfWeekId,
          dayOfWeekNameEn: detail.dayOfWeekNameEn,
          startTime: detail.startTime,
          startDate: doctorSchedule.startDate,
          endDate: doctorSchedule.endDate,
          endTime: detail.endTime,
          isActive: doctorSchedule.isActive,
          isPriority: doctorSchedule.isPriority,
          slotDurationMinutes: Number(detail.slotDurationMinutes!)
        }))

        this.selectedSchedules.set(mappedSchedule);
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

        if (this.oid()) {
          this.store.getDoctorSchedule(this.oid());
        }else{
          this.cancel();
        }
        this.store.setScheduleSuccess(false);
      }
    });

    // effect(() => {
    //   const success = this.store.scheduleSuccess();
    //   if (success) {
    //     this.cancel();
    //     this.store.setScheduleSuccess(false);
    //   }
    // });

  }




  addSchedule() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    if (this.oid()) {
      this.selectedSchedules.update(list =>
        list.map(item => ({
          ...item,
          doctorId: v.doctorId!,
          specialtyId: v.specialityId!,
          branchId: v.branchId!,
          statusId: v.statusId!,
          clinicNumber: v.clinicNumber,
          startDate: v.startDate,
          endDate: v.endDate,
        }))
      );
    }

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
          specialtyId: v.specialityId!,
          branchId: v.branchId!,
          statusId: v.statusId!,
          dayOfWeekId: dayId,
          dayOfWeekNameEn: day?.valueNameEn ?? '',
          startTime: start,
          isLocal: true,
          startDate: v.startDate,
          endDate: v.endDate,
          endTime: end,
          isActive: v.isActive === 'Active',
          isPriority: v.isPriority === 'Yes',
          // isActive: v.isActive,
          // isPriority: v.isPriority,
          slotDurationMinutes: Number(v.slotDurationMinutes!)
        }
      ]);
    });

    //  this.form.reset();

    this.form.patchValue({
      dayOfWeekId: [],
      startTime: null,
      endTime: null,
      slotDurationMinutes: null
    });

    // mark only these controls as untouched + pristine
    ['dayOfWeekId', 'startTime', 'endTime', 'slotDurationMinutes']
      .forEach(field => {
        const control = this.form.get(field);
        control?.markAsUntouched();
        control?.markAsPristine();
      });

    if (!this.showTitle()) {
      this.saveSchedule();
    }
  }


  createSchedule() {
    this.createBulk();

  }

  saveSchedule() {
    if (this.oid())
      this.updateMasterSchedule()
    else
      this.createSchedule();
  }

  // createSingle() {
  //   const payload = this.getSinglePayload()
  //   this.store.addDoctorSchedule(payload);
  // }


  createBulk() {
    const payload = this.getPayload();
    this.store.addBulkDoctorSchedule(payload);
  }

  updateMasterSchedule() {
    const schedules = this.selectedSchedules();
    const newDetails = schedules
      .filter(s => s.isLocal)
      .map(s => ({
        masterId: this.oid(),
        dayOfWeekId: s.dayOfWeekId,
        startTime: s.startTime,
        endTime: s.endTime,
        slotDurationMinutes: Number(s.slotDurationMinutes)
      }));

    const masterPayload = {
      id: this.oid(),
      body: this.getEditMasterSchedulePayload()
    };

    this.store.updateDoctorScheduleWithDetails({
      master: masterPayload,
      newDetails
    });
  }

  getEditMasterSchedulePayload() {
    const schedules = this.selectedSchedules();
    return {
      oid: this.oid(),
      doctorId: schedules[0]?.doctorId,
      statusId: schedules[0]?.statusId,
      branchId: schedules[0]?.branchId,
      specialtyId: schedules[0]?.specialtyId,
      isActive: schedules[0]?.isActive,
      isPriority: schedules[0]?.isPriority,
      startDate: this.shared.formatDateOnly(schedules[0]?.startDate),
      endDate: this.shared.formatDateOnly(schedules[0]?.endDate),
    };
  }

  startEdit(slot: any) {
    if (slot)
      this.editingSlotId.set(slot.oid);
    else this.editingSlotId.set(null);

  }
  editSchedule(schedule: any) {
    if (this.oid() && !schedule.isLocal) {
      const payload = this.getEditDetailPayload(schedule);
      this.store.updateDetailDoctorSchedule({ id: schedule.oid, body: payload });
    }
    else {
      this.selectedSchedules.update(list =>
        list.filter(s => s.oid !== schedule.oid)
      );
      this.selectedSchedules.update(list => [
        ...list,
        schedule
      ]);
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
      doctorScheduleDetailList: schedules.map(s => ({
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
      statusId: schedule.statusId,
      branchId: schedule.branchId,
      specialtyId: schedule.specialtyId,
      dayOfWeekId: schedule.dayOfWeekId,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      slotDurationMinutes: Number(schedule.slotDurationMinutes),
      isActive: true,
      isPriority: false,
      startDate: this.shared.formatDateOnly(schedule.startDate),
      endDate: this.shared.formatDateOnly(schedule.endDate),
    };

  }

  getSinglePayload() {
    return this.buildSchedulePayload();
  }


  deleteSchedule(schedule: any) {
    if (this.oid() && !schedule.isLocal) {
      this.store.deleteDetailDoctorSchedule(schedule.oid);
    } else
      this.selectedSchedules.update(list =>
        list.filter(s => s.oid !== schedule.oid)
      );
  }

  cancel() {
    this.form.reset();
    this.selectedSchedules.set([]);
    this.cancalEvent.emit();
  }
}
