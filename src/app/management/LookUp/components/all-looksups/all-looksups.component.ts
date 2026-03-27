// import { Component, computed, effect, inject, signal } from '@angular/core';
// import { ReusableMaterialTableComponent } from 'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
// import { LookUpMasterFormComponent } from '../look-up-master-form/look-up-master-form.component';
// import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
// import { LOOKUPStore } from '../../store/lookup.store';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { PageEvent } from '@angular/material/paginator';
// import { Sort } from '@angular/material/sort';
// import { LookUpDetailsFormComponent } from '../look-up-details-form/look-up-details-form.component';

// type ViewMode = 'table' | 'masterForm' | 'detailsForm';
// @Component({
//   selector: 'app-all-looksups',
//   imports: [ReusableMaterialTableComponent, LookUpMasterFormComponent, LookUpDetailsFormComponent],
//   templateUrl: './all-looksups.component.html',
//   styleUrl: './all-looksups.component.scss'
// })
// export class AllLooksupsComponent {
//   private breadcrumb = inject(BreadcrumbService);
//   private store = inject(LOOKUPStore);
//   lookups = computed(() => this.store.items());
//   total = computed(() => this.store.total());
//   pageSize = computed(() => this.store.pageSize());
//   loading = computed(() => this.store.loading());
//   viewMode = signal<ViewMode>('table');
//   lookupCode: string = '';
//   columns = [
//     { field: 'lookupCode', header: 'Code', type: 'text' },
//     { field: 'lookupNameEn', header: 'Name', type: 'text' },
//     { field: 'lookupNameAr', header: 'Arabic Name', type: 'text' },
//     { field: 'description', header: 'Desxription', type: 'text' },
//     {
//       field: 'isSystem',
//       header: 'System Look up',
//       type: 'badge',
//       badge: {
//         trueLabel: 'Yes',
//         falseLabel: 'No',
//         trueClass: 'bg-success',
//         falseClass: 'bg-danger'
//       }
//     },
//     // { field: 'actions', header: 'Actions', type: 'buttons' }
//   ];


//   breadcrumbClick = toSignal(this.breadcrumb.breadcrumbClick$, { initialValue: null });

//   constructor() {
//     effect(() => {
//       const crumb = this.breadcrumbClick();
//       if (!crumb) return;

//       if (crumb.label === 'LookUps') {
//         this.viewMode.set('table');
//         this.lookupCode = '';
//         this.breadcrumb.resetToRoute();
//       }
//     });
//   }

//   ngOnInit() {
//     this.breadcrumb.resetToRoute();
//   }
//   // 🔹 table event handlers
//   onPageChange(event: PageEvent) {
//     console.log('pagination', event);
//     // this.store.setPage(event.pageIndex + 1, event.pageSize);
//   }

//   onFilterChange(value: string) {
//     console.log('filter', value);
//     this.store.setSearch(value);
//   }

//   onSortChange(sort: Sort) {
//     console.log('sort', sort);
//     this.store.setSort(sort);
//   }

//   // handleEdit(row: any) {
//   //   this.lookupCode = row.lookupCode;
//   //   this.viewMode.set('masterForm');
//   //   this.breadcrumb.setBreadcrumbs([
//   //     { label: 'LookUps', url: '/looks-up' },
//   //     { label: 'Edit Lookup', url: '' }
//   //   ]);
//   // }

//   // handleDelete(row: any) {
//   //   // this.store.deleteDoctor(row.oid)
//   // }

//   handleSingleLookupMasterNavigation(row: any) {
//     this.lookupCode = row.lookupCode;
//     this.viewMode.set('masterForm');
//     this.breadcrumb.setBreadcrumbs([
//       { label: 'LookUps', url: '/looks-up' },
//       { label: 'Look Up Details', url: '' }
//     ]);
//   }
//   handleAddNew() {
//     this.viewMode.set('masterForm');

//     this.breadcrumb.setBreadcrumbs([
//       { label: 'LookUps', url: '/looks-up' },
//       { label: 'Add Lookup', url: '' }
//     ]);
//   }
//   handleAddNewDetails() {
//     this.viewMode.set('detailsForm');

//     this.breadcrumb.setBreadcrumbs([
//       { label: 'LookUps', url: '/looks-up' },
//       { label: 'Add Lookup Details', url: '/looks-up/createDetails' }
//     ]);
//   }

//   onCancel() {
//     console.log('in cacnel');
//     this.lookupCode = "";
//     this.store.clearSelectedItem();
//     this.viewMode.set('table');
//     console.log('viewMode',this.viewMode());
//     this.breadcrumb.resetToRoute();
//   }

// }



import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReusableMaterialTableComponent } from 'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
import { LookUpMasterFormComponent } from '../look-up-master-form/look-up-master-form.component';
import { LookUpDetailsFormComponent } from '../look-up-details-form/look-up-details-form.component';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { LOOKUPStore } from '../../store/lookup.store';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

type ViewMode = 'table' | 'masterForm' | 'detailsForm';

@Component({
  selector: 'app-all-looksups',
  standalone: true,
  imports: [
    ReusableMaterialTableComponent,
    LookUpMasterFormComponent,
    LookUpDetailsFormComponent
  ],
  templateUrl: './all-looksups.component.html',
  styleUrl: './all-looksups.component.scss'
})
export class AllLooksupsComponent {

  // 🔹 inject
  private breadcrumb = inject(BreadcrumbService);
  private store = inject(LOOKUPStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // 🔹 state
  lookups = computed(() => this.store.items());
  total = computed(() => this.store.total());
  pageSize = computed(() => this.store.pageSize());
  loading = computed(() => this.store.loading());

  viewMode = signal<ViewMode>('table');
  lookupCode: string = '';

  // 🔹 columns
  columns = [
    { field: 'lookupCode', header: 'Code', type: 'text' },
    { field: 'lookupNameEn', header: 'Name', type: 'text' },
    { field: 'lookupNameAr', header: 'Arabic Name', type: 'text' },
    { field: 'description', header: 'Description', type: 'text' },
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
    }
  ];

  constructor() { }

  // 🔥 ROUTE → STATE
  ngOnInit() {
    this.breadcrumb.resetToRoute();

    this.route.queryParams.subscribe(params => {
      console.log('QUERY PARAMS:', params);

      const mode = params['mode'];
      const code = params['code'];

      if (!mode) {
        this.viewMode.set('table');
        this.lookupCode = '';
        return;
      }

      if (mode === 'master') {
        this.viewMode.set('masterForm');
        this.lookupCode = code || '';
        return;
      }

      if (mode === 'details') {
        this.viewMode.set('detailsForm');
        this.lookupCode = code || '';
        return;
      }
    });
  }

  // 🔹 table events
  onPageChange(event: PageEvent) {
    console.log('pagination', event);
  }

  onFilterChange(value: string) {
    this.store.setSearch(value);
  }

  onSortChange(sort: Sort) {
    this.store.setSort(sort);
  }

  // 🔥 navigation

  handleSingleLookupMasterNavigation(row: any) {
    this.router.navigate(['/looks-up'], {
      queryParams: { mode: 'master', code: row.lookupCode }
    });
  }

  handleAddNew() {
    this.router.navigate(['/looks-up'], {
      queryParams: { mode: 'master' }
    });
  }

  handleAddNewDetails() {
    this.router.navigate(['/looks-up'], {
      queryParams: { mode: 'details', code: this.lookupCode }
    });
  }

  onCancel() {
    this.router.navigate(['/looks-up']);
  }
}
