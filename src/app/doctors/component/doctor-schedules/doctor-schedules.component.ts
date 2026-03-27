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
  doctorScheduleId:string='';
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

  ngOnInit() {
    this.breadcrumb.resetToRoute();

    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      const id = params['id'];
      const doctorId = params['doctorId'];


      console.log('MODE:', mode, 'ID:', id);

      switch (mode) {
        case 'create':
          this.viewMode.set('doctorScheduleForm');
          this.oid = '';
          this.doctorScheduleId = ''
          break;

        case 'doctor-create':
          this.viewMode.set('doctorScheduleForm');
          this.oid = '';
          this.doctorScheduleId = doctorId
          break;

        case 'edit':
          this.viewMode.set('doctorScheduleForm');
          this.oid = id || '';
          this.doctorScheduleId = ''
          break;

        default:
          this.viewMode.set('table');
          this.oid = '';
          this.doctorScheduleId = ''
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
    // const schedule = this.schedules().find(s => s.oid === row.oid);

    // if (!schedule) return;


    // const detailOids = schedule.details?.map(d => d.oid) ?? [];

    // console.log('DETAIL OIDS:', detailOids);

    // this.store.deleteFullSchedulePeriod({
    //   oid: row.oid,
    //   details:detailOids
    // });

    this.store.deleteDoctorSchedule(row.oid);
  }

  onCancal() {
    if(!this.doctorScheduleId)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
    else{
      this.router.navigate(['/doctors'],
        {queryParams:{
             mode:"edit",
             id:this.doctorScheduleId
        }}
      )
    }
  }



}
