import { Component, computed, effect, EventEmitter, inject, input, output, Output, signal } from '@angular/core';
import { DoctorStore } from '../../doctorStore/doctorStore';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Doctor } from '../../models/doctor';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { ToggleBtnComponent } from 'src/app/common/toggle-btn/toggle-btn.component';
import { InputComponent } from 'src/app/common/input/input.component';
import { UsersStore } from 'src/app/management/user/userStore/userStore';
import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
import { LookupService } from 'src/app/common/service/lookup.service';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { HospitalBranchService } from 'src/app/Hospital/Services/hospital-branch.service';
import { SpecialityService } from 'src/app/Hospital/Services/speciality.service';
import { ValidationErrorService } from 'src/app/common/service/validation-error.service';
import { SpecialityStore } from 'src/app/Hospital/Store/Speciality/speciality.store';
import { WorkingDayCardComponent } from '../doctor-schedule-form/working-day-card/working-day-card.component';
import SpkFlatpickrComponent from 'src/app/common/spk-flatpickr/spk-flatpickr.component';
import { APIDoctorSchedule, APIDoctorScheduleBulk, APIDoctorScheduleItem, DoctorScheduleDetail, GroupedSchedule } from '../../models/doctor-schedule';
import { DoctorScheduleFormComponent } from '../doctor-schedule-form/doctor-schedule-form.component';
import { Speciality } from '../../../Hospital/models/speciality';
import { DoctorVM } from '../../models/doctor-vm';
import { Filter, RequestWrapper } from 'src/app/common/Models/request';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-doctor-form',
  imports: [ButtonComponent, ToggleBtnComponent, InputComponent,DoctorScheduleFormComponent,KeyValuePipe,
    SpkNgSelectComponent, SpkFlatpickrComponent ,ReactiveFormsModule, AsyncPipe, WorkingDayCardComponent],
  templateUrl: './doctor-form.component.html',
  styleUrl: './doctor-form.component.scss',
  providers: [UsersStore, SpecialityStore]

})
export class DoctorFormComponent {
  @Output() cancalEvent = new EventEmitter<any>();
  oid = input<string>('');
  addWorkingDay = output<void>();
  shared=inject(SharedService);
  fb = inject(FormBuilder);
  store = inject(DoctorStore);
  userStore = inject(UsersStore);
  lookupService = inject(LookupService);
  branchService = inject(HospitalBranchService);
  specialityService = inject(SpecialityService);
  specialityStore = inject(SpecialityStore);
  specialities=computed(()=> this.specialityStore.items())
  validationErrorService = inject(ValidationErrorService);
  doctorSchedules=this.store.selectedDoctorSchedules;
  users = computed(() => this.userStore.users());
  departments$ = this.lookupService.getDepartment();
  genders$ = this.lookupService.getGender();
  activeStatus$=this.lookupService.getActiveStatus();
  licenseTypes$ = this.lookupService.getLookUpByCode('LICENSE_TYPE');
  subSpecialties$ = this.lookupService.getLookUpByCode('SUB_SPECIALTY');
  branches$ = this.branchService.getBranches();
  specialities$ = this.specialityService.getSpecialities();
  // editingSchedule = signal<APIDoctorSchedule | null>(null);
  newSchedule=signal<boolean  > (false);
  showScheduleForm = signal(false);
  editingSlotId = signal<string | null>(null);
  firstTimeToggle=signal(true);
  groupedSchedules = computed(() => {

    // const groups: Record<string, APIDoctorSchedule[]> = {};

    // const schedules = this.doctorSchedules();
    // console.log('schedules', schedules);
    // schedules.forEach(s => {

    //   if (!groups[s.dayOfWeekNameEn]) {
    //     groups[s.dayOfWeekNameEn] = [];
    //   }

    //   groups[s.dayOfWeekNameEn].push(s);

    // });

    // const groups: Record<string, GroupedSchedule[]> = {};

    // const schedules = this.doctorSchedules();

    // schedules.forEach(s => {
    //   s.details?.forEach(detail => {
    //     const day = detail.dayOfWeekNameEn;

    //     if (!day) return;

    //     if (!groups[day]) {
    //       groups[day] = [];
    //     }

    //     groups[day].push({
    //       ...s,
    //       detail
    //     });
    //   });
    // });

    const groups: Record<string, (APIDoctorScheduleItem & { masterId: string })[]> = {};

    const schedules = this.doctorSchedules();

    schedules.forEach(s => {
      s.details?.forEach(detail => {
        const day = detail.dayOfWeekNameEn;

        if (!day) return;

        if (!groups[day]) {
          groups[day] = [];
        }

        groups[day].push({
          ...detail,
          masterId: s.oid   // 👈 هنا المهم
        });
      });
    });
    console.log('groups',groups);
    return groups;
  });
  form = this.fb.group({
    userId: ['', Validators.required],
    firstNameAr: ['', Validators.required],
    middleNameAr: ['', Validators.required],
    lastNameAr: ['', Validators.required],
    firstNameEn: ['', Validators.required],
    middleNameEn: ['', Validators.required],
    lastNameEn: ['', Validators.required],
    genderId: ['', Validators.required],
    licenseNumber: ['', Validators.required],
    licenseTypeId: ['', Validators.required],
    licenseIssueDate: ['', Validators.required],
    licenseExpiryDate: ['', Validators.required],
    specialtyId: ['', Validators.required],
    subSpecialtyId: ['', Validators.required],
    departmentId: ['', Validators.required],
    mobile: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    yearsOfExperience: [0, [Validators.required, Validators.min(0)]],
    consultationFee: [0, [Validators.required, Validators.min(0)]],
    branchId: ['', Validators.required],
    nphiesProviderId: [''],
    nphiesLicenseNumber: [''],
    isNphiesEnabled: [false],
    isActive: [false],
  });

  weekDays$ = this.lookupService.getDays();
  weekDaysSnapshot: any[] = [];

  doctor: DoctorVM | null=null ;
  private backendErrorKeyMap: Record<string, string[]> = {
    userId: ['userId'],
    firstNameAr: ['firstNameAr'],
    middleNameAr: ['middleNameAr'],
    lastNameAr: ['lastNameAr'],
    firstNameEn: ['firstNameEn'],
    middleNameEn: ['middleNameEn'],
    lastNameEn: ['lastNameEn'],
    genderId: ['genderId'],
    licenseNumber: ['licenseNumber'],
    licenseTypeId: ['licenseTypeId'],
    licenseIssueDate: ['licenseIssueDate'],
    licenseExpiryDate: ['licenseExpiryDate'],
    specialtyId: ['specialtyId'],
    subSpecialtyId: ['subSpecialtyId'],
    departmentId: ['departmentId'],
    mobile: ['mobile'],
    phone: ['phone'],
    email: ['email'],
    yearsOfExperience: ['yearsOfExperience'],
    consultationFee: ['consultationFee'],
    branchId: ['branchId'],
    nphiesProviderId: ['nphiesProviderId'],
    nphiesLicenseNumber: ['nphiesLicenseNumber'],
  };
  apiFieldErrors: Record<string, string> = {};

  workingHoursCollapsed = signal(true);
  constructor() {
    this.weekDays$.subscribe(res => {
      this.weekDaysSnapshot = res?.lookupDetails ?? [];
    });


    effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.form.reset();
        return;
      }
      this.store.getDoctor(oid);
    });




    effect(() => {
      const doctor = this.store.selectedDoctor();
      if (doctor) {
        this.doctor=doctor
        this.form.patchValue({
          userId: doctor.userId,
          firstNameAr: doctor.firstNameAr,
          middleNameAr: doctor.middleNameAr,
          lastNameAr: doctor.lastNameAr,
          firstNameEn: doctor.firstNameEn,
          middleNameEn: doctor.middleNameEn,
          lastNameEn: doctor.lastNameEn,
          genderId: doctor.genderId,
          licenseNumber: doctor.licenseNumber,
          licenseTypeId: doctor.licenseTypeId,
          licenseIssueDate: doctor.licenseIssueDate,
          licenseExpiryDate: doctor.licenseExpiryDate,
          specialtyId: doctor.specialtyId,
          subSpecialtyId: doctor.subSpecialtyId,
          departmentId: doctor.departmentId,
          mobile: doctor.mobile,
          phone: doctor.phone,
          email: doctor.email,
          yearsOfExperience: doctor.yearsOfExperience,
          consultationFee: doctor.consultationFee,
          branchId: doctor.branchId,
          nphiesProviderId: doctor.nphiesProviderId ?? '',
          nphiesLicenseNumber: doctor.nphiesLicenseNumber ?? '',
          isActive: doctor.isActive ?? false,
          isNphiesEnabled: doctor.isNphiesEnabled ?? false,
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
      if (success)
        this.cancel();
      this.store.setSuccess(false);
    });

  }

  toggleWorkingHours() {
    if (this.firstTimeToggle()){
      // this.store.loadDoctorSchedules(this.oid());

            const filters: Filter[] = [{
              propertyName: "doctorId",
              value: this.oid(),
              operation: 0
            }];
            const body:RequestWrapper={
              request:{
                filters: filters,
                sort: [],
                pagination: {
                  getAll: true,
                  pageNumber: 0,
                  pageSize: 0,
                },
                columns: []
              }
            }

      this.store.queryDoctorSchedules(body);
      this.firstTimeToggle.set(false);
    }
    this.workingHoursCollapsed.update(v => !v);
  }


  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.valid && !this.oid()) {
      this.createDoctor();
    }
    if (this.form.valid && this.oid()) {
      this.editDoctor();
    }
  }
  createDoctor() {
    this.store.addDoctor(this.getPayload());
  }
  editDoctor() {
    console.log('in edit');
    this.store.updateDoctor({ id: this.oid(), body: this.getPayload() });

  }

  getPayload() {
    const v = this.form.getRawValue();
    const payload: Doctor = {
      ...(this.oid() ? { oid: this.oid() } : {}),

      userId: v.userId!,
      firstNameAr: v.firstNameAr!,
      middleNameAr: v.middleNameAr!,
      lastNameAr: v.lastNameAr!,
      firstNameEn: v.firstNameEn!,
      middleNameEn: v.middleNameEn!,
      lastNameEn: v.lastNameEn!,
      genderId: v.genderId!,
      licenseNumber: v.licenseNumber!,
      licenseTypeId: v.licenseTypeId!,
      licenseIssueDate: this.shared.formatDateOnly(v.licenseIssueDate!),
      licenseExpiryDate: this.shared.formatDateOnly(v.licenseExpiryDate!),
      branchId: v.branchId!,
      specialtyId: v.specialtyId!,
      subSpecialtyId: v.subSpecialtyId!,
      departmentId: v.departmentId!,
      mobile: v.mobile!,
      phone: v.phone!,
      email: v.email!,
      yearsOfExperience: Number(v.yearsOfExperience) || 0,
      consultationFee: Number(v.consultationFee) || 0,
      nphiesProviderId: v.nphiesProviderId ?? '',
      nphiesLicenseNumber: v.nphiesLicenseNumber ?? '',
      isNphiesEnabled: v.isNphiesEnabled ?? false,
      isActive: v.isActive ?? true,
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

  // addAnotherWorkingHours() {
  //   this.addWorkingDay.emit();
  //  }


  addAnotherWorkingHours() {
    // if (this.editingSchedule()) this.editingSchedule.set(null);
    this.newSchedule.set(true);
    this.showScheduleForm.set(true);
}


   //handle Schedule

  editSchedule(schedule: any) {
      this.updateSchedule(schedule);

  }

  updateSchedule(schedule: any) {
    const payload = this.getEditPayload(schedule);
    this.store.updateDetailDoctorSchedule({ id: payload.oid!, body: payload });
  }

  getEditPayload(schedule: any): DoctorScheduleDetail {
    const payload={
      oid:schedule.oid!,
      masterId: schedule.masterId,
      dayOfWeekId: schedule.dayOfWeekId,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      slotDurationMinutes: schedule.slotDurationMinutes
    }
    return payload;
  }

  deleteSchedule(schedule: any) {
    this.store.deleteDetailDoctorSchedule(schedule.oid);

  }

  closeScheduleForm() {
    this.showScheduleForm.set(false);
    // if (this.editingSchedule())
    // this.editingSchedule.set(null);
  if(this.newSchedule())
    this.newSchedule.set(false);

  }

  startEdit(slot: any) {
    if (slot)
      this.editingSlotId.set(slot.oid);
    else this.editingSlotId.set(null);

  }
}

