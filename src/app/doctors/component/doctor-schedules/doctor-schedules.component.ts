import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReusableMaterialTableComponent } from 'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { DoctorStore } from '../../doctorStore/doctorStore';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { DoctorScheduleFormComponent } from '../doctor-schedule-form/doctor-schedule-form.component';
type ViewMode = 'table' | 'doctorScheduleForm';

@Component({
  selector: 'app-doctor-schedules',
  imports: [ReusableMaterialTableComponent,DoctorScheduleFormComponent],
  templateUrl: './doctor-schedules.component.html',
  styleUrl: './doctor-schedules.component.scss'
})
export class DoctorSchedulesComponent {
  private breadcrumb = inject(BreadcrumbService);
  private store = inject(DoctorStore);
  schedules = computed(() => [...this.store.DoctorSchedules()]);
    total = computed(() => this.store.total());
  pageSize = computed(() => this.store.pageSize());
  loading = computed(() => this.store.loading());
  oid: string = '';
  scheduleOid: string = '';
  viewMode = signal<ViewMode>('table');
  columns = [
    { field: 'doctorName', header: 'Doctor Name', type: 'text' },
    { field: 'branchName', header: 'Branch Number', type: 'text' },
    { field: 'specialtyName', header: 'Speciality Name', type: 'text' },
    { field: 'status', header: 'Status', type: 'text' },
    {
      field: 'isActive',
      header: 'Active',
      type: 'badge',
      badge: {
        trueLabel: 'Active',
        falseLabel: 'Inactive',
        trueClass: 'bg-success',
        falseClass: 'bg-danger'
      }
    },
    {
      field: 'isPriority',
      header: 'Priority',
      type: 'badge',
      badge: {
        trueLabel: 'Yes',
        falseLabel: 'No',
        trueClass: 'bg-success',
        falseClass: 'bg-danger'
      }
    },
    { field: 'actions', header: 'Actions', type: 'buttons' }
  ];


  breadcrumbClick = toSignal(this.breadcrumb.breadcrumbClick$, { initialValue: null });

  constructor() {
    effect(() => {
      const crumb = this.breadcrumbClick();
      if (!crumb) return;

      if (crumb.label === 'Doctors Schedules') {
        this.viewMode.set('table');
        this.oid = '';
        this.breadcrumb.resetToRoute();
      }
    });

    this.store.loadDoctorSchedules();
  }

  ngOnInit() {
    this.breadcrumb.resetToRoute();
  }

  onPageChange(event: PageEvent) {
    console.log('pagination', event);
    this.store.setPage(event.pageIndex + 1, event.pageSize);
    // this.store.setPage(event.pageIndex, event.pageSize);
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
    this.viewMode.set('doctorScheduleForm');
    this.breadcrumb.setBreadcrumbs([
      { label: 'Doctors', url: '/doctors' },
      { label: 'Schedules', url: '/doctors/schedules' },
      { label: 'Edit Doctor Schedule', url: '' }
    ]);
  }

  handleDelete(row: any) {
    this.store.deleteDoctorSchedule(row.oid);
  }

  handleSingleUserNavigation(row: any) {
    this.oid = row.oid;
    this.viewMode.set('doctorScheduleForm');

    this.breadcrumb.setBreadcrumbs([
      { label: 'Doctors', url: '/doctors' },
      { label: 'Schedules', url: '/doctors/schedules' },
      { label: 'Doctor Schedule Details', url: '' }
    ]);
  }
  handleAddNew() {
    this.viewMode.set('doctorScheduleForm');
    this.breadcrumb.setBreadcrumbs([
      { label: 'Doctors', url: '/doctors' },
      { label: 'Schedules', url: '/doctors/schedules' },
      { label: 'Add Doctor Schedule', url: '' }
    ]);
  }

  onCancal() {
    this.viewMode.set('table');
    this.oid = "";
    this.store.clearSelectedItem();
    this.breadcrumb.resetToRoute();
  }




}
