import { Component, inject } from '@angular/core';
import { DoctorScheduleFormComponent } from '../doctor-schedule-form/doctor-schedule-form.component';
import { Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';

@Component({
  selector: 'app-doctor-schedule',
  imports: [DoctorScheduleFormComponent],
  templateUrl: './doctor-schedule.component.html',
  styleUrl: './doctor-schedule.component.scss'
})
export class DoctorScheduleComponent {
  private router = inject(Router);
  onCancel() {
    this.router.navigateByUrl(`doctors/schedules`);
  }
}
