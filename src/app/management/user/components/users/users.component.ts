
// import { Component, computed, effect, inject, signal } from '@angular/core';
// import { UsersStore } from '../../userStore/userStore';
// import { ReusableMaterialTableComponent } from
//   'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
// import { PageEvent } from '@angular/material/paginator';
// import { Sort } from '@angular/material/sort';
// import { Router } from '@angular/router';
// import { UserFormComponent } from '../user-form/user-form.component';
// import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
// import { toSignal } from '@angular/core/rxjs-interop';

// @Component({
//   selector: 'app-users',
//   standalone: true,
//   imports: [ReusableMaterialTableComponent, UserFormComponent],
//   templateUrl: './users.component.html',
//   styleUrl: './users.component.scss'
// })
// export class UsersComponent {
//   private breadcrumb = inject(BreadcrumbService);
//   private store = inject(UsersStore);
//   users = computed(() => this.store.users());
//   total = computed(() => this.store.total());
//   pageSize = computed(() => this.store.pageSize());
//   loading = computed(() => this.store.loading());
//   hidden=signal<boolean>(false);
//   oid:string='';
//   // 🔹 table columns
//   columns = [
//     { field: 'username', header: 'Full Name', type: 'text' },
//     { field: 'email', header: 'Email', type: 'text' },
//     { field: 'mobile', header: 'Phone Number', type: 'text' },
//     {
//       field: 'gender',
//       header: 'Gender',
//       type: 'text',
//       formatter: (value?: string) => {
//         if (!value) return '-';
//         return value;
//         // return value.toLowerCase() === 'm'
//         //   ? 'Male'
//         //   : value.toLowerCase() === 'f'
//         //     ? 'Female'
//         //     : '-';
//       }
//     },
//     { field: 'birthDate', header: 'Birth Date', type: 'date', format: 'dd/MM/yyyy' },
//     {
//       field: 'isActive',
//       header: 'Status',
//       type: 'badge',
//       badge: {
//         trueLabel: 'Active',
//         falseLabel: 'Inactive',
//         trueClass: 'bg-success',
//         falseClass: 'bg-danger'
//       }
//     },
//     { field: 'actions', header: 'Actions', type: 'buttons' }
//   ];


//   breadcrumbClick = toSignal(this.breadcrumb.breadcrumbClick$, { initialValue: null });

//   constructor() {
//     effect(() => {
//       const crumb = this.breadcrumbClick();
//       if (!crumb) return;

//       if (crumb.label === 'Users') {
//         this.hidden.set(false);
//         this.oid = '';
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
//     this.store.setPage(event.pageIndex + 1, event.pageSize);
//     // this.store.setPage(event.pageIndex, event.pageSize);
//   }

//   onFilterChange(value: string) {
//     console.log('filter', value);
//     this.store.setSearch(value);
//   }

//   onSortChange(sort: Sort) {
//     console.log('sort', sort);
//     this.store.setSort(sort);
//   }

//   handleEdit(row: any) {
//     this.oid=row.oid;
//     this.toggleHidden();
//     this.breadcrumb.setBreadcrumbs([
//       { label: 'Users', url: '/users' },
//       { label: 'Edit User', url: '' }
//     ]);
//   }

//   handleDelete(row: any) {
//     this.store.deleteUser(row.oid)
//   }

//   handleSingleUserNavigation(row: any) {
//     this.oid = row.oid;
//     this.toggleHidden();
//     this.breadcrumb.setBreadcrumbs([
//       { label: 'Users', url: '/users' },
//       { label: 'User Details', url: '' }
//     ]);
//   }
//   handleAddNewUser(){
//     this.toggleHidden();
//     this.breadcrumb.setBreadcrumbs([
//       { label: 'Users', url: '/users' },
//       { label: 'Add User', url: '' }
//     ]);
//   }
//   toggleHidden(){
//     this.hidden.update(state => !state);
//   }
//   onCancal(){
//     this.hidden.set(false);
//     this.oid="";
//     this.store.clearSelectedItem();
//     this.breadcrumb.resetToRoute();
//   }
// }
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersStore } from '../../userStore/userStore';
import { ReusableMaterialTableComponent } from
  'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { UserFormComponent } from '../user-form/user-form.component';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReusableMaterialTableComponent, UserFormComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  // 🔹 inject
  private breadcrumb = inject(BreadcrumbService);
  private store = inject(UsersStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // 🔹 state
  users = computed(() => this.store.users());
  total = computed(() => this.store.total());
  pageSize = computed(() => this.store.pageSize());
  loading = computed(() => this.store.loading());

  hidden = signal<boolean>(false);
  oid: string = '';

  // 🔹 table columns
  columns = [
    { field: 'username', header: 'Full Name', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'mobile', header: 'Phone Number', type: 'text' },
    {
      field: 'gender',
      header: 'Gender',
      type: 'text',
      formatter: (value?: string) => value || '-'
    },
    { field: 'birthDate', header: 'Birth Date', type: 'date', format: 'dd/MM/yyyy' },
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

  constructor() { }

  // 🔥 ROUTE → STATE
  ngOnInit() {
    this.breadcrumb.resetToRoute();

    this.route.queryParams.subscribe(params => {
      console.log('QUERY PARAMS:', params);

      const mode = params['mode'];
      const id = params['id'];

      if (!mode) {
        // table
        this.hidden.set(false);
        this.oid = '';
        return;
      }

      if (mode === 'create') {
        this.hidden.set(true);
        this.oid = '';
        return;
      }

      if (mode === 'edit') {
        this.hidden.set(true);
        this.oid = id || '';
        return;
      }
    });
  }

  // 🔹 table events
  onPageChange(event: PageEvent) {
    this.store.setPage(event.pageIndex + 1, event.pageSize);
  }

  onFilterChange(value: string) {
    this.store.setSearch(value);
  }

  onSortChange(sort: Sort) {
    this.store.setSort(sort);
  }

  // 🔥 NAVIGATION (URL controls UI)

  handleAddNewUser() {
    this.router.navigate(['/users'], {
      queryParams: { mode: 'create' }
    });
  }

  handleEdit(row: any) {
    this.router.navigate(['/users'], {
      queryParams: { mode: 'edit', id: row.oid }
    });
  }

  handleSingleUserNavigation(row: any) {
    this.router.navigate(['/users'], {
      queryParams: { mode: 'edit', id: row.oid }
    });
  }

  handleDelete(row: any) {
    this.store.deleteUser(row.oid);
  }

  onCancal() {
    this.router.navigate(['/users']);
  }
}
