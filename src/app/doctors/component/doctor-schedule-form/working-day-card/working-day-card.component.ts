import { Component, computed, EventEmitter, inject, input, Output } from '@angular/core';
import { DoctorStore } from 'src/app/doctors/doctorStore/doctorStore';
import { APIDoctorSchedule, DoctorSchedule } from 'src/app/doctors/models/doctor-schedule';

@Component({
  selector: 'app-working-day-card',
  imports: [],
  templateUrl: './working-day-card.component.html',
  styleUrl: './working-day-card.component.scss'
})
export class WorkingDayCardComponent {
  private store=inject(DoctorStore);
  @Output() editSchedule = new EventEmitter<APIDoctorSchedule>();
  @Output() deleteSchedule = new EventEmitter<APIDoctorSchedule>();

  schedule = input.required<APIDoctorSchedule>();
  formatTo12Hour(time24h: string | null): string {
    if (!time24h) return '';

    const [hoursStr, minutesStr] = time24h.split(':');
    if (!hoursStr || !minutesStr) return '';

    let hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    const modifier = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    return `${hours}:${minutes.toString().padStart(2, '0')} ${modifier}`;
  }


}
