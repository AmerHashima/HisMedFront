import { Component, computed, inject } from '@angular/core';
import { UsersStore } from '../../userStore/userStore';
import { ReusableMaterialTableComponent } from
  'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReusableMaterialTableComponent],
  providers: [UsersStore],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  private store = inject(UsersStore);
  private router=inject(Router);
  users = computed(() => this.store.users());
  total = computed(() => this.store.total());
  pageSize = computed(() => this.store.pageSize());
  loading = computed(() => this.store.loading());

  // 🔹 table columns
  columns = [
    { field: 'username', header: 'Full Name', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'mobile', header: 'Phone Number', type: 'text' },
    {
      field: 'gender',
      header: 'Gender',
      type: 'text',
      formatter: (value?: string) => {
        if (!value) return '-';
        return value.toLowerCase() === 'm'
          ? 'Male'
          : value.toLowerCase() === 'f'
            ? 'Female'
            : '-';
      }
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

  // 🔹 table event handlers
  onPageChange(event: PageEvent) {
    console.log('pagination',event);
    this.store.setPage(event.pageIndex + 1, event.pageSize);
    // this.store.setPage(event.pageIndex, event.pageSize);
  }

  onFilterChange(value: string) {
    console.log('filter',value);
    this.store.setSearch(value);  }

  onSortChange(sort: Sort) {
    console.log('sort',sort);
    this.store.setSort(sort);
  }

  handleEdit(row: any) {
    this.router.navigateByUrl(`/users/edit/${row.oid}`);
    // this.router.navigate(['/users/edit', row.oid]);
  }

  handleDelete(row: any) {
    this.store.deleteUser(row.oid)
  }

  handleSingleUserNavigation(row:any){
    this.router.navigateByUrl(`/users/user/${row.oid}`);

  }
}
