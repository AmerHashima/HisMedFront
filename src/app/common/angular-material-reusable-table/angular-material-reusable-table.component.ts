// import { Component, Input, ViewChild, AfterViewInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Component, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common'; // <-- Needed for *ngIf and *ngFor
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-reusable-material-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  standalone: true,
  templateUrl: './angular-material-reusable-table.component.html',
  styleUrl: './angular-material-reusable-table.component.scss'
})
// export class ReusableMaterialTableComponent implements AfterViewInit {
//   @Input() columns: any[] = []
//   @Input() displayedColumns: string[] = []; // Keys of data to display
//   @Input() columnHeaders: Record<string, string> = {}; // Column header display names
//   @Input() data: any[] = []; // Array of objects to show
//   @Input() showPaginator: boolean = true;
//   @Input() pageSizeOptions: number[] = [5, 10, 20];
//   @Input() showFilter: boolean = true;
//   @Input() stickyHeader: boolean = false;
//   @Output() editRow = new EventEmitter<any>();
//   @Output() deleteRow = new EventEmitter<any>();


//   filterValue: string = '';

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;
//   dataSource = new MatTableDataSource<any>([]);


//   // ngOnInit(): void {
//   //   this.dataSource = new MatTableDataSource(this.data);
//   // }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['data'] && changes['data'].currentValue) {
//       this.dataSource.data = changes['data'].currentValue ?? [];
//       // Optional: reset paginator to first page when data changes
//       if (this.paginator) {
//         this.paginator.firstPage();
//       }
//     }
//   }

//   ngAfterViewInit(): void {
//     if (this.showPaginator && this.paginator) {
//       this.dataSource.paginator = this.paginator;
//     }
//     if (this.sort) {
//       this.dataSource.sort = this.sort;
//     }
//   }



//   applyFilter(event: Event) {
//     const value = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = value.trim().toLowerCase();

//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }


//   get columnKeys(): string[] {
//     return this.columns.map(c => c.field);
//   }
//   onEdit(element: any) {
//     this.editRow.emit(element);
//   }

//   onDelete(element: any) {
//     this.deleteRow.emit(element);
//   }

//   getCellValue(element: any, col: any): any {
//     const value = element[col.field];
//     console.log('value', value);
//     if (col.formatter && typeof col.formatter === 'function') {
//       return col.formatter(value, element);
//     }

//     return value ?? '-';
//   }

//   getBadgeLabel(value: boolean, col: any): string {
//     return value ? col.badge?.trueLabel : col.badge?.falseLabel;
//   }

//   getBadgeClass(value: boolean, col: any): string {
//     return value ? col.badge?.trueClass : col.badge?.falseClass;
//   }
// }

export class ReusableMaterialTableComponent implements AfterViewInit {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];

  @Input() totalCount = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [10, 20, 50];

  @Input() showPaginator = true;
  @Input() showFilter = true;
  @Input() stickyHeader = false;

  @Output() editRow = new EventEmitter<any>();
  @Output() deleteRow = new EventEmitter<any>();

  @Output() filterChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<any>();
  @Output() onFirstCellClickChange = new EventEmitter<any>();


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    if (this.sort) {
      this.sort.sortChange.subscribe(sort => {
        this.sortChange.emit(sort);
      });
    }
  }

  onFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();
    this.filterChange.emit(value);
  }

  onFirstCellClick(row: any, rowIndex: number, colIndex: number) {
    console.log(`First cell of row ${rowIndex} clicked`, row);
    this.onFirstCellClickChange.emit(row);
  }


  get columnKeys(): string[] {
    return this.columns.map(c => c.field);
  }

  onEdit(row: any) {
    this.editRow.emit(row);
  }

  onDelete(row: any) {
    this.deleteRow.emit(row);
  }

  getCellValue(row: any, col: any): any {
    const value = row[col.field];
    if (col.formatter) {
      return col.formatter(value, row);
    }
    return value ?? '-';
  }

  getBadgeLabel(value: boolean, col: any): string {
    return value ? col.badge?.trueLabel : col.badge?.falseLabel;
  }

  getBadgeClass(value: boolean, col: any): string {
    return value ? col.badge?.trueClass : col.badge?.falseClass;
  }
}
