// import { Component, computed, effect, inject, Signal, signal } from '@angular/core';
// import { ReusableMaterialTableComponent } from 'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
// import { BreadcrumbItem, BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
// import { DoctorStore } from '../../doctorStore/doctorStore';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { PageEvent } from '@angular/material/paginator';
// import { Sort } from '@angular/material/sort';
// import { DoctorScheduleFormComponent } from '../doctor-schedule-form/doctor-schedule-form.component';
// type ViewMode = 'table' | 'doctorScheduleForm';

// @Component({
//   selector: 'app-doctor-schedules',
//   imports: [ReusableMaterialTableComponent,DoctorScheduleFormComponent],
//   templateUrl: './doctor-schedules.component.html',
//   styleUrl: './doctor-schedules.component.scss'
// })
// export class DoctorSchedulesComponent {
//   private breadcrumb = inject(BreadcrumbService);
//   private store = inject(DoctorStore);
//   schedules = computed(() => [...this.store.DoctorSchedules()]);
//     total = computed(() => this.store.total());
//   pageSize = computed(() => this.store.pageSize());
//   loading = computed(() => this.store.loading());
//   oid: string = '';
//   scheduleOid: string = '';
//   viewMode = signal<ViewMode>('table');
//   columns = [
//     { field: 'doctorName', header: 'Doctor Name', type: 'text' },
//     { field: 'branchName', header: 'Branch Number', type: 'text' },
//     { field: 'specialtyName', header: 'Speciality Name', type: 'text' },
//     { field: 'status', header: 'Status', type: 'text' },
//     {
//       field: 'isActive',
//       header: 'Active',
//       type: 'badge',
//       badge: {
//         trueLabel: 'Active',
//         falseLabel: 'Inactive',
//         trueClass: 'bg-success',
//         falseClass: 'bg-danger'
//       }
//     },
//     {
//       field: 'isPriority',
//       header: 'Priority',
//       type: 'badge',
//       badge: {
//         trueLabel: 'Yes',
//         falseLabel: 'No',
//         trueClass: 'bg-success',
//         falseClass: 'bg-danger'
//       }
//     },
//     { field: 'actions', header: 'Actions', type: 'buttons' }
//   ];


//   breadcrumbClick!: Signal<BreadcrumbItem | null>;

//   constructor() {
//     this.breadcrumbClick = toSignal(
//       inject(BreadcrumbService).breadcrumbClick$,
//       { initialValue: null }
//     );

//     effect(() => {
//       const crumb = this.breadcrumbClick();
//       console.log('EFFECT RUN', crumb);

//       if (!crumb) return;

//       switch (crumb.url) {
//         case '/doctors/schedules':
//           this.viewMode.set('table');
//           this.oid = '';
//           break;
//       }
//     });

//     this.store.loadDoctorSchedules();
//   }

//   ngOnInit() {
//     this.breadcrumb.resetToRoute();
//   }

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
//     this.oid = row.oid;
//     this.viewMode.set('doctorScheduleForm');
//     // this.breadcrumb.setBreadcrumbs([
//     //   { label: 'Doctors', url: '/doctors' },
//     //   { label: 'Schedules', url: '/doctors/schedules' },
//     //   { label: 'Edit Doctor Schedule', url: '' }
//     // ]);

//     this.breadcrumb.setBreadcrumbs([
//       {
//         label: 'Doctors',
//         url: '/doctors',
//         action: { type: 'viewMode', value: 'table' }
//       },
//       {
//         label: 'Schedules',
//         url: '/doctors/schedules',
//         action: { type: 'viewMode', value: 'table' }
//       },
//       {
//         label: 'Edit Doctor Schedule',
//         url:'',
//         action: { type: 'viewMode', value: 'doctorScheduleForm', extra: row.oid }
//       }
//     ]);
//   }

//   handleDelete(row: any) {
//     this.store.deleteDoctorSchedule(row.oid);
//   }

//   handleSingleUserNavigation(row: any) {
//     this.oid = row.oid;
//     this.viewMode.set('doctorScheduleForm');

//     this.breadcrumb.setBreadcrumbs([
//       { label: 'Doctors', url: '/doctors' },
//       { label: 'Schedules', url: '/doctors/schedules' },
//       { label: 'Doctor Schedule Details', url: '' }
//     ]);
//   }
//   handleAddNew() {
//     this.viewMode.set('doctorScheduleForm');
//     this.breadcrumb.setBreadcrumbs([
//       { label: 'Doctors', url: '/doctors' },
//       { label: 'Schedules', url: '/doctors/schedules' },
//       { label: 'Add Doctor Schedule', url: '' }
//     ]);
//   }

//   onCancal() {
//     this.viewMode.set('table');
//     this.oid = "";
//     this.store.clearSelectedItem();
//     this.breadcrumb.resetToRoute();
//   }




// }
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReusableMaterialTableComponent } from 'src/app/common/angular-material-reusable-table/angular-material-reusable-table.component';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { DoctorStore } from '../../doctorStore/doctorStore';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { DoctorScheduleFormComponent } from '../doctor-schedule-form/doctor-schedule-form.component';

type ViewMode = 'table' | 'doctorScheduleForm';

@Component({
  selector: 'app-doctor-schedules',
  standalone: true,
  imports: [ReusableMaterialTableComponent, DoctorScheduleFormComponent],
  templateUrl: './doctor-schedules.component.html',
  styleUrl: './doctor-schedules.component.scss'
})
export class DoctorSchedulesComponent {

  // 🔹 inject
  private breadcrumb = inject(BreadcrumbService);
  private store = inject(DoctorStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // 🔹 state
  schedules = computed(() => [...this.store.DoctorSchedules()]);
  total = computed(() => this.store.total());
  pageSize = computed(() => this.store.pageSize());
  loading = computed(() => this.store.loading());

  oid: string = '';
  viewMode = signal<ViewMode>('table');

  // 🔹 table columns
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

  constructor() {
    this.store.loadDoctorSchedules();
  }

  // 🔥 ROUTE → STATE (the important part)
  ngOnInit() {
    this.breadcrumb.resetToRoute();

    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      const id = params['id'];

      console.log('MODE:', mode, 'ID:', id);

      switch (mode) {
        case 'create':
          this.viewMode.set('doctorScheduleForm');
          this.oid = '';
          break;

        case 'edit':
          this.viewMode.set('doctorScheduleForm');
          this.oid = id || '';
          break;

        default:
          this.viewMode.set('table');
          this.oid = '';
          break;
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

  // 🔥 navigation actions (ONLY change URL)

  handleAddNew() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { mode: 'create' }
    });
  }

  handleEdit(row: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { mode: 'edit', id: row.oid }
    });
  }

  handleSingleUserNavigation(row: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { mode: 'edit', id: row.oid }
    });
  }

  handleDelete(row: any) {
    this.store.deleteDoctorSchedule(row.oid);
  }

  onCancal() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('in all schediles destory')
  }
}
