import { Component, effect, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { SpkNgSelectComponent } from 'src/app/common/spk-ng-select/spk-ng-select.component';
import { LookupService } from 'src/app/common/service/lookup.service';
import { AsyncPipe } from '@angular/common';
import { DoctorStore } from '../../doctorStore/doctorStore';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorService } from 'src/app/common/service/validation-error.service';
import { ButtonComponent } from 'src/app/common/button/button.component';
import { DoctorSchedule } from '../../models/doctor-schedule';

@Component({
  selector: 'app-doctor-schedule-form',
  imports: [SpkNgSelectComponent, AsyncPipe,ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './doctor-schedule-form.component.html',
  styleUrl: './doctor-schedule-form.component.scss'
})
export class DoctorScheduleFormComponent {
  @Output() cancalEvent = new EventEmitter<any>();
  private lookupService = inject(LookupService);
  private store=inject(DoctorStore);
  doctors = this.store.doctors;
  weekDays$=this.lookupService.getDays();
  workingHours$=this.lookupService.getDayHours();
  slotDurations$ = this.lookupService.getSlotDuration();
  fb = inject(FormBuilder);
  id: string = '';
  validationErrorService = inject(ValidationErrorService);
  oid = input<string>('');

  form = this.fb.group({

    doctorId: [null, [Validators.required]],
    dayOfWeekId: [null, [Validators.required]],
    startTime: [null, [Validators.required]],
    endTime: [null, [Validators.required]],
    slotDurationMinutes: [null, [Validators.required]],

  });

  private backendErrorKeyMap: Record<string, string[]> = {
    doctorId: ['doctorId'],
    StartTime: ['startTime'],
    EndTime: ['endTime'],
  };
  apiFieldErrors: Record<string, string> = {};

  constructor(){
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
      const success = this.store.scheduleSuccess();
      console.log('success effect',success);

      if (success)
       {
        console.log('success');
        this.cancel();
        this.store.setScheduleSuccess(false);
       }
    });
  }

  onSubmit(){
    console.log(this.form.invalid);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.valid) {
      this.createDoctotSchedule();}

  }
  createDoctotSchedule(){
    this.store.addDoctorSchedule(this.getPayload());
  }


  getPayload() {
    const v = this.form.getRawValue();

    const to24Hour = (time12h: string | null): string => {
      if (!time12h) return '00:00:00'; // handles null or empty string
      const parts = time12h.split(' ');
      if (parts.length !== 2) return '00:00:00';

      const [time, modifier] = parts;
      const [hoursStr, minutesStr] = time.split(':');
      if (!hoursStr || !minutesStr) return '00:00:00';

      let hours = Number(hoursStr);
      const minutes = Number(minutesStr);

      if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
      if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    };

    const payload: DoctorSchedule = {
      doctorId: v.doctorId!,
      dayOfWeekId: v.dayOfWeekId!,
      startTime: to24Hour(v.startTime),
      endTime: to24Hour(v.endTime),
      slotDurationMinutes: v.slotDurationMinutes!
    };

    console.log('payload', payload);

    return payload;
  }
    cancel() {
      console.log('in schedule cancel');
      this.form.markAsUntouched();
      this.form.reset();
      this.cancalEvent.emit();
    }
}
