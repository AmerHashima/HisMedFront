import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReusableMaterialTableComponent } from 'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
import { LookUpMasterFormComponent } from '../look-up-master-form/look-up-master-form.component';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { LOOKUPStore } from '../../store/lookup.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-all-looksups',
  imports: [ReusableMaterialTableComponent,LookUpMasterFormComponent],
  templateUrl: './all-looksups.component.html',
  styleUrl: './all-looksups.component.scss'
})
export class AllLooksupsComponent {
  private breadcrumb = inject(BreadcrumbService);
  private store = inject(LOOKUPStore);
  // specialities = computed(() => this.store.specialities());
  lookups = computed(() => this.store.items());
  total = computed(() => this.store.total());
  pageSize = computed(() => this.store.pageSize());
  loading = computed(() => this.store.loading());
  hidden = signal<boolean>(false);
  // oid: string = '';
  columns = [
    { field: 'lookupCode', header: 'Code', type: 'text' },
    { field: 'lookupNameEn', header: 'Name', type: 'text' },
    { field: 'lookupNameAr', header: 'Arabic Name', type: 'text' },
    { field: 'description', header: 'Desxription', type: 'text' },
    {
      field: 'isSystem',
      header: 'System Look up',
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

      if (crumb.label === 'LookUps') {
        this.hidden.set(false);
        // this.oid = '';
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
    // this.oid = row.oid;
    this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'LookUps', url: '/looks-up' },
      { label: 'Edit Lookup', url: '' }
    ]);
  }

  handleDelete(row: any) {
    // this.store.deleteDoctor(row.oid)
  }

  handleSingleUserNavigation(row: any) {
    // this.oid = row.oid;
    this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'LookUps', url: '/looks-up' },
      { label: 'Look Up Details', url: '' }
    ]);
  }
  handleAddNew() {
    this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'LookUps', url: '/looks-up' },
      { label: 'Add Lookup', url: '' }
    ]);
  }
  toggleHidden() {
    this.hidden.update(state => !state);
  }
  onCancal() {
    console.log('in cancal');
    this.hidden.set(false);
    // this.oid = "";
    this.breadcrumb.resetToRoute();
  }
}
