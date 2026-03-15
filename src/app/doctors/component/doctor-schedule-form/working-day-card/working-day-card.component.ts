// import { Component, computed, EventEmitter, inject, input, Output } from '@angular/core';
// import { DoctorStore } from 'src/app/doctors/doctorStore/doctorStore';
// import { APIDoctorSchedule, DoctorSchedule } from 'src/app/doctors/models/doctor-schedule';

// @Component({
//   selector: 'app-working-day-card',
//   imports: [],
//   templateUrl: './working-day-card.component.html',
//   styleUrl: './working-day-card.component.scss'
// })
// export class WorkingDayCardComponent {
//   private store=inject(DoctorStore);
//   // @Output() editSchedule = new EventEmitter<APIDoctorSchedule>();
//   // @Output() deleteSchedule = new EventEmitter<APIDoctorSchedule>();

//   // schedule = input.required<APIDoctorSchedule>();
//   @Output() editSchedule = new EventEmitter<any>();
//   @Output() deleteSchedule = new EventEmitter<any>();

//   schedule = input.required<any>();
//   formatTo12Hour(time24h: string | null): string {
//     if (!time24h) return '';

//     const [hoursStr, minutesStr] = time24h.split(':');
//     if (!hoursStr || !minutesStr) return '';

//     let hours = Number(hoursStr);
//     const minutes = Number(minutesStr);

//     const modifier = hours >= 12 ? 'PM' : 'AM';

//     hours = hours % 12;
//     hours = hours === 0 ? 12 : hours;

//     return `${hours}:${minutes.toString().padStart(2, '0')} ${modifier}`;
//   }


// }


import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-working-day-card',
  standalone: true,
  imports:[NgFor,FormsModule,NgIf,JsonPipe],
  templateUrl: './working-day-card.component.html',
  styleUrl: './working-day-card.component.scss'
})
export class WorkingDayCardComponent {
  editingSlotId = input<string | null>(null);

  @Output() editSchedule = new EventEmitter<any>();
  @Output() startingEdit = new EventEmitter<any>();

  @Output() deleteSchedule = new EventEmitter<any>();

  dayName = input.required<string>();
  slots = input.required<any[]>();

  constructor() {
    console.log('WorkingDayCard created');
  }

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


  startEdit(slot: any) {
    slot.startTime = slot.startTime?.substring(0, 5);
    slot.endTime = slot.endTime?.substring(0, 5);
    this.startingEdit.emit(slot);
  }

  saveEdit(slot: any) {
    slot.startTime = slot.startTime + ':00';
    slot.endTime = slot.endTime + ':00';
    this.startingEdit.emit(null);
    this.editSchedule.emit(slot);

  }

  cancelEdit() {
    this.startingEdit.emit(null);
  }


}
