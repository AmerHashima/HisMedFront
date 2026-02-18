import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ReusableMaterialTableComponent } from 'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
import { SpecialityStore } from 'src/app/Hospital/Store/Speciality/speciality.store';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { SpecialityFormComponent } from '../speciality-form/speciality-form.component';

@Component({
  selector: 'app-all-specialities',
  imports: [ReusableMaterialTableComponent,SpecialityFormComponent],
  templateUrl: './all-specialities.component.html',
  styleUrl: './all-specialities.component.scss'
})
export class AllSpecialitiesComponent {
  private breadcrumb = inject(BreadcrumbService);
  private store = inject(SpecialityStore);
  specialities = computed(() => this.store.specialities());
  total = computed(() => this.store.total());
  pageSize = computed(() => this.store.pageSize());
  loading = computed(() => this.store.loading());
  hidden = signal<boolean>(false);
  oid: string = '';
  columns = [
    { field: 'code', header: 'Code', type: 'text' },
    { field: 'nameEn', header: 'Name', type: 'text' },
    { field: 'defaultVisitDuration', header: 'Visit Duration', type: 'text' },
    { field: 'defaultPrice', header: 'Price', type: 'text' },

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

      if (crumb.label === 'Specialities') {
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
      { label: 'Specialities', url: '/hospital/Specialities' },
      { label: 'Edit Speciality', url: '' }
    ]);
  }

  handleDelete(row: any) {
    // this.store.deleteDoctor(row.oid)
  }

  handleSingleUserNavigation(row: any) {
    this.oid = row.oid;
    this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'Specialities', url: '/hospital/Specialities' },
      { label: 'Speciality Details', url: '' }
    ]);
  }
  handleAddNew() {
    this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'Specialities', url: '/hospital/Specialities' },
      { label: 'Add Speciality', url: '' }
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
