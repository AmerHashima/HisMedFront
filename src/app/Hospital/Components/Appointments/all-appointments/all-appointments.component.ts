import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReusableMaterialTableComponent } from 'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
import { AppotntmentFormComponent } from '../appotntment-form/appotntment-form.component';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { AppointmentStore } from 'src/app/Hospital/Store/Appointment/appointment.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-all-appointments',
  imports: [ReusableMaterialTableComponent, AppotntmentFormComponent],
  templateUrl: './all-appointments.component.html',
  styleUrl: './all-appointments.component.scss'
})
export class AllAppointmentsComponent {
  private breadcrumb = inject(BreadcrumbService);
  private store = inject(AppointmentStore);
  appointments = computed(() => this.store.items());
  total = computed(() => this.store.total());
  pageSize = computed(() => this.store.pageSize());
  loading = computed(() => this.store.loading());
  hidden = signal<boolean>(false);
  oid: string = '';
  columns = [
    { field: 'patientMRN', header: 'Patient Mrn', type: 'text' },
    { field: 'patientName', header: 'Patient Name', type: 'text' },
    { field: 'doctorName', header: 'Doctor Name', type: 'text' },
    { field: 'specialtyName', header: 'Specialty Name', type: 'text' },
    { field: 'appointmentDate', header: 'Appointment Date', type: 'text' },
    { field: 'appointmentType', header: 'Appointment Type', type: 'text' },
    { field: 'branchName', header: 'Branch Name', type: 'text' },
    { field: 'actions', header: 'Actions', type: 'buttons' }
  ];


  breadcrumbClick = toSignal(this.breadcrumb.breadcrumbClick$, { initialValue: null });

  constructor() {
    effect(() => {
      const crumb = this.breadcrumbClick();
      if (!crumb) return;

      if (crumb.label === 'Appointments') {
        this.hidden.set(false);
        this.oid = '';
        this.breadcrumb.resetToRoute();
      }
    });
  }

  ngOnInit() {
    this.breadcrumb.resetToRoute();
  }
  // 🔹 table event handlers
  onPageChange(event: PageEvent) {
    console.log('pagination', event);
    // this.store.setPage(event.pageIndex + 1, event.pageSize);
  }

  onFilterChange(value: string) {
    console.log('filter', value);
    this.store.setSearch(value);
  }

  onSortChange(sort: Sort) {
    console.log('sort', sort);
    this.store.setSort(sort);
  }

  handleEdit(row: any) {
    this.oid = row.oid;
    this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'Appointments', url: '/hospital/appointments' },
      { label: 'Edit Appointment', url: '' }
    ]);
  }

  handleDelete(row: any) {
    // this.store.deleteDoctor(row.oid)
  }

  handleSingleUserNavigation(row: any) {
    this.oid = row.oid;
    this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'Appointments', url: '/hospital/appointments' },
      { label: 'Appointment Details', url: '' }
    ]);
  }
  handleAddNew() {
    this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'Appointments', url: '/hospital/appointments' },
      { label: 'Add Appointment', url: '' }
    ]);
  }
  toggleHidden() {
    this.hidden.update(state => !state);
  }
  onCancal() {
    this.hidden.set(false);
    this.oid = "";
    this.breadcrumb.resetToRoute();
  }
}
