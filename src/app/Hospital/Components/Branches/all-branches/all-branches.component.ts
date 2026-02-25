import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ReusableMaterialTableComponent } from 'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
import { BranchStore } from 'src/app/Hospital/Store/Branch/branch.store';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { BranchFormComponent } from '../branch-form/branch-form.component';

@Component({
  selector: 'app-all-branches',
  imports: [  ReusableMaterialTableComponent,BranchFormComponent],
  templateUrl: './all-branches.component.html',
  styleUrl: './all-branches.component.scss'
})
export class AllBranchesComponent {
  private breadcrumb = inject(BreadcrumbService);
  private store = inject(BranchStore);
  // specialities = computed(() => this.store.specialities());
  branches = computed(() => this.store.items());
  total = computed(() => this.store.total());
  pageSize = computed(() => this.store.pageSize());
  loading = computed(() => this.store.loading());
  hidden = signal<boolean>(false);
  oid: string = '';
  columns = [
    { field: 'code', header: 'Code', type: 'text' },
    { field: 'name', header: 'Name', type: 'text' },
    { field: 'address', header: 'Address', type: 'text' },
    { field: 'city', header: 'City', type: 'text' },
    { field: 'country', header: 'Country', type: 'text' },
    { field: 'state', header: 'State', type: 'text' },
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

      if (crumb.label === 'Branches') {
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
      { label: 'Branches', url: '/hospital/branches' },
      { label: 'Edit Branch', url: '' }
    ]);
  }

  handleDelete(row: any) {
    // this.store.deleteDoctor(row.oid)
  }

  handleSingleUserNavigation(row: any) {
    this.oid = row.oid;
    this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'Branches', url: '/hospital/branches' },
      { label: 'Branch Details', url: '' }
    ]);
  }
  handleAddNew() {
    this.toggleHidden();
    this.breadcrumb.setBreadcrumbs([
      { label: 'Branches', url: '/hospital/branches' },
      { label: 'Add Branch', url: '' }
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
