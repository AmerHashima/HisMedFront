// import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
// import {  FilePondModule } from 'ngx-filepond';
// import * as FilePond from 'filepond';
// import { DecimalPipe } from '@angular/common';      // ← for | number
// import { ButtonComponent } from '../button/button.component';

// @Component({
//   selector: 'app-file-upload',
//   standalone: true,
//   imports: [FilePondModule, DecimalPipe, ButtonComponent],
//   templateUrl: './file-upload.component.html',
//   styleUrl: './file-upload.component.scss',
// })
// export class FileUploadComponent {
//   @ViewChild('myPond') myPond: any;
//   @Input() multiple: boolean = true;
//   @Input() label: string = 'Drop files here to Upload...';

//   @Output() filesChange = new EventEmitter<FilePond.FilePondFile[]>();

//   pondOptions: FilePond.FilePondOptions = {};

//   pondFiles: FilePond.FilePondOptions['files'] = [];


//   constructor() {
//     this.updateOptions();
//   }

//   ngOnChanges() {
//     this.updateOptions();
//   }

//   private updateOptions() {
//     this.pondOptions = {
//       allowMultiple: this.multiple,
//       labelIdle: this.label,
//       // add more options like acceptedFileTypes, maxFileSize, server, etc.
//     };
//   }

//   pondHandleInit() {
//     console.log('FilePond initialized');
//   }
//   pondHandleAddFile(event: any) {
//     // event is actually [error, file] or { error, file } at runtime
//     const error = Array.isArray(event) ? event[0] : event?.error;
//     const file = Array.isArray(event) ? event[1] : event?.file;

//     if (error) {
//       console.error('Add file error:', error);
//       return;
//     }

//     console.log('File added:', file?.filename || file);
//     this.emitFiles();  // your method to notify parent / update state
//   }

//   pondHandleRemoveFile(event: any) {
//     const error = Array.isArray(event) ? event[0] : event?.error;
//     const file = Array.isArray(event) ? event[1] : event?.file;

//     if (error) {
//       console.error('Remove file error:', error);
//       return;
//     }

//     console.log('File removed:', file?.filename || file);
//     this.emitFiles();
//   }
//   private emitFiles() {
//     const files = this.myPond?.getFiles() || [];
//     this.filesChange.emit(files);
//   }

//   // Public methods the parent can call
//   public addFile(file: File) {
//     this.myPond?.addFile(file);
//   }

//   public removeAllFiles() {
//     this.myPond?.removeFiles();
//   }

//   public getFiles(): FilePond.FilePondFile[] {
//     return this.myPond?.getFiles() || [];
//   }
//   clearFiles() {
//     this.removeAllFiles();
//   }

//   uploadAll() {
//     if (!this.getFiles().length) {
//       alert('No files selected');
//       return;
//     }

//     // Example: upload logic
//     const formData = new FormData();
//     this.getFiles().forEach(fileItem => {
//       formData.append('files', fileItem.file);
//     });

//     // this.http.post('/api/upload', formData).subscribe(...);
//   }

// }

import {
  Component,
  ViewChild,
  Input,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { FilePondModule } from 'ngx-filepond';
import * as FilePond from 'filepond';
import { DecimalPipe } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { FilePondFile, FilePondInitialFile } from 'filepond';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [FilePondModule, DecimalPipe, ButtonComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {

  @ViewChild('myPond') myPond!: any;

  @Input() multiple = true;
  @Input() label = 'Drop files here to Upload...';

  pondOptions: FilePond.FilePondOptions = {};
  pondFiles: FilePond.FilePondOptions['files'] = [];

  private disabled = false;

  /* ===== CVA callbacks ===== */
  private onChange: (value: File[]) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() {
    this.updateOptions();
  }

  ngOnChanges() {
    this.updateOptions();
  }

  /* ================== CVA ================== */

  writeValue(files: File[] | null): void {
    if (!files || !files.length) {
      this.pondFiles = [];
      this.myPond?.removeFiles();
      return;
    }

    this.pondFiles = files.map(
      (file): FilePondInitialFile => ({
        source: file as any,
        options: { type: 'local' }
      })
    );
  }

  registerOnChange(fn: (value: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.updateOptions();
  }

  /* ============== FilePond ================= */

  private updateOptions() {
    this.pondOptions = {
      allowMultiple: this.multiple,
      labelIdle: this.label,
      disabled: this.disabled
    };
  }

  pondHandleInit() {
    console.log('FilePond initialized');
  }

  pondHandleAddFile() {
    this.emitToForm();
  }

  pondHandleRemoveFile() {
    this.emitToForm();
  }

  private emitToForm() {
    const files: File[] = this.myPond
      ?.getFiles()
      .map((f: FilePondFile) => f.file) || [];

    this.onChange(files);
    this.onTouched();
  }

  /* ===== Public API (optional) ===== */

  clearFiles() {
    this.myPond?.removeFiles();
    this.onChange([]);
  }

  getFiles(): FilePondFile[] {
    return this.myPond?.getFiles() || [];
  }

  uploadAll(endPoint:string) {
    const files = this.getFiles();
    if (!files.length) return;

    const formData = new FormData();
    files.forEach(f => formData.append('files', f.file));
    console.log('on load');
    // this.http.post('/api/upload', formData).subscribe(...)
  }
}
