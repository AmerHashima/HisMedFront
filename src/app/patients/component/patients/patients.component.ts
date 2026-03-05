// src\app\patients\component\patients\patients.component.ts
import { Component, computed, effect, inject, signal } from '@angular/core';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { PatientStore } from '../../patientStore/patient.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ReusableMaterialTableComponent } from 'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
import { PatientFormComponent } from '../patient-form/patient-form.component';
// import { SpkToastComponent } from 'src/app/@spk/reusable-ui-elements/spk-toast/spk-toast.component';

@Component({
  selector: 'app-patients',
  imports: [ReusableMaterialTableComponent, PatientFormComponent],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss'
})
export class PatientsComponent {
  private breadcrumb = inject(BreadcrumbService);
  private store = inject(PatientStore);
  patients = computed(() => this.store.patients());
  total = computed(() => this.store.total());
  pageSize = computed(() => this.store.pageSize());
  loading = computed(() => this.store.loading());
  hidden = signal<boolean>(false);
  oid: string = '';
  columns = [
    { field: 'fullNameEn', header: 'Full Name', type: 'text' },
    { field: 'mrn', header: 'MRN', type: 'text' },
    { field: 'bloodGroupName', header: 'Blood Group', type: 'text' },
    { field: 'age', header: 'Age', type: 'text' },
    { field: 'mobile', header: 'Phone', type: 'text' },
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

      if (crumb.label === 'Patients') {
        this.hidden.set(false);
        this.oid = '';
        this.breadcrumb.resetToRoute();
      }
    });
  }

  ngOnInit() {
    this.breadcrumb.resetToRoute();
  }
  // table event handlers
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
    this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'Patients', url: '/patients' },
      { label: 'Edit Patient', url: '' }
    ]);
  }

  handleDelete(row: any) {
    this.store.deletePatient(row.oid)
  }

  handleSingleUserNavigation(row: any) {
    this.oid = row.oid;
    this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'Patients', url: '/patients' },
      { label: 'Patient Details', url: '' }
    ]);
  }
  handleAddNew() {
    this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'Patients', url: '/patients' },
      { label: 'Add Patient', url: '' }
    ]);
  }
  toggleHidden() {
    this.hidden.update(state => !state);
  }
  onCancal() {
    this.hidden.set(false);
    this.oid = "";
    this.store.clearSelectedItem();
    this.breadcrumb.resetToRoute();
  }


}
