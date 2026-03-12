import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReusableMaterialTableComponent } from 'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
import { DoctorFormComponent } from '../doctor-form/doctor-form.component';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { DoctorStore } from '../../doctorStore/doctorStore';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { DoctorScheduleFormComponent } from '../doctor-schedule-form/doctor-schedule-form.component';

type ViewMode = 'table' | 'doctorForm' | 'scheduleForm';

@Component({
  selector: 'app-doctors',
  imports: [ReusableMaterialTableComponent, DoctorFormComponent, DoctorScheduleFormComponent],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss',
  // providers: [DoctorStore]
})


export class DoctorsComponent {
  private breadcrumb = inject(BreadcrumbService);
  private store = inject(DoctorStore);
  doctors = computed(() => this.store.doctors());
  total = computed(() => this.store.total());
  pageSize = computed(() => this.store.pageSize());
  loading = computed(() => this.store.loading());
  hidden = signal<boolean>(false);
  oid: string = '';
  scheduleOid:string='';
    viewMode = signal<ViewMode>('table');
  // 🔹 table columns
  columns = [
    { field: 'username', header: 'Username', type: 'text' },

    { field: 'doctorFullName', header: 'Doctor Name', type: 'text' },
    { field: 'licenseNumber', header: 'license Number', type: 'text' },
    { field: 'branchName', header: 'Branch', type: 'text' },
    { field: 'specialtyNameEn', header: 'Speciality', type: 'text' },
    {
      field: 'isActive',
      header: 'Status',
      type: 'badge',
      badge: {
        trueLabel: 'Active',
        falseLabel: 'Inactive',
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

      if (crumb.label === 'Doctors') {
        this.viewMode.set('table');
        // this.hidden.set(false);
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
      this.viewMode.set('doctorForm');
    // this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'Doctors', url: '/doctors' },
      { label: 'Edit Doctor', url: '' }
    ]);
  }

  handleDelete(row: any) {
    this.store.deleteDoctor(row.oid)
  }

  handleSingleUserNavigation(row: any) {
    this.oid = row.oid;
    this.viewMode.set('doctorForm');

    // this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'Doctors', url: '/doctors' },
      { label: 'Doctor Details', url: '' }
    ]);
  }
  handleAddNew() {
    // this.toggleHidden();
    this.viewMode.set('doctorForm');
    this.breadcrumb.setBreadcrumbs([
      { label: 'Doctors', url: '/doctors' },
      { label: 'Add Doctor', url: '' }
    ]);
  }
  toggleHidden() {
    this.hidden.update(state => !state);
  }
  onCancal() {
    // this.hidden.set(false);
    this.viewMode.set('table');
    this.oid = "";
    this.store.clearSelectedItem();
    this.breadcrumb.resetToRoute();
  }

  addWorkingDay(){
    this.viewMode.set('scheduleForm');
    this.breadcrumb.setBreadcrumbs([
      { label: 'Doctors', url: '/doctors' },
      { label: 'Add Doctor Schedule', url: '' }
    ]);
  }

  onCancelSchedule(){
    console.log('in cancel schedule');
    this.viewMode.set('doctorForm');
    // this.oid = "";
    // this.store.clearSelectedItem();
    // this.breadcrumb.resetToRoute();
  }
}
