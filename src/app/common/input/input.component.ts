


// import { Component,signal, computed,input, Optional,Self,AfterViewInit,inject,Signal} from '@angular/core';
// import { ControlValueAccessor, NgControl } from '@angular/forms';
// import {  map } from 'rxjs';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { Injector } from '@angular/core';

// @Component({
//   selector: 'app-input',
//   templateUrl: './input.component.html',
//   styleUrl: './input.component.scss',
// })
// export class InputComponent implements ControlValueAccessor, AfterViewInit {
//   private injector = inject(Injector);
//   label = input<string>('');
//   type = input<string>('text');
//   placeholder = input<string>('');
//   icon = input<string | undefined>();
//   errorMessages = input<Record<string, string>>({});

//   value = signal('');
//   isDisabled = signal(false);

//   // Local signals
//   isTouched = signal(false);
//   dirtySignal = signal(false);

//   // Signals from form control
//   statusSignal!: Signal<string>;
//   errorsSignal!: Signal<Record<string, any> | null>;
//   constructor(@Optional() @Self() public ngControl: NgControl) {
//     if (this.ngControl) {
//       this.ngControl.valueAccessor = this;
//     }
//   }


//   ngAfterViewInit() {
//     const control = this.ngControl?.control;
//     if (!control) return;

//     const events$ = control.events;

//     this.statusSignal = toSignal(
//       events$.pipe(map(() => control.status)),
//       { injector: this.injector, initialValue: control.status }
//     );

//     this.errorsSignal = toSignal(
//       events$.pipe(map(() => control.errors || null)),
//       { injector: this.injector, initialValue: control.errors }
//     );

//     events$.subscribe((event: any) => {
//       this.isTouched.set(control.touched);
//       this.dirtySignal.set(control.dirty);

//       if (!control.touched && !control.dirty) {
//         this.isTouched.set(false);
//         this.dirtySignal.set(false);
//       }
//     });
//   }

//   showErrors = computed(() =>
//     (this.isTouched() || this.dirtySignal()) &&
//     this.statusSignal() === 'INVALID'
//   );

//   getErrorMessage = computed(() => {
//     const errs = this.errorsSignal();
//     if (!errs) return '';
//     const key = Object.keys(errs)[0];
//     return (
//       this.errorMessages()[key] ||
//       errs[key]?.message ||
//       'Invalid value'
//     );
//   });

//   onChange = (_: any) => { };
//   onTouched = () => { };

//   writeValue(value: any): void {
//     this.value.set(value ?? '');
//   }

//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: any): void {
//     this.onTouched = fn;
//   }

//   setDisabledState(isDisabled: boolean): void {
//     this.isDisabled.set(isDisabled);
//   }

//   onInput(e: Event): void {
//     const v = (e.target as HTMLInputElement).value;
//     this.value.set(v);
//     this.onChange(v);
//     this.dirtySignal.set(true);
//   }

//   onBlur(): void {
//     this.isTouched.set(true);
//     this.onTouched();
//   }
// }


import {
  Component, signal, computed, input,
  Optional, Self, AfterViewInit, inject,
  Signal, DestroyRef
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  private destroyRef = inject(DestroyRef);

  // Inputs
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  icon = input<string | undefined>();
  errorMessages = input<Record<string, string>>({});

  // Value signals
  value = signal('');
  isDisabled = signal(false);
  isTouched = signal(false);
  isDirty = signal(false);

  // Form control signals
  statusSignal = signal<string>('VALID');
  errorsSignal = signal<Record<string, any> | null>(null);

  // CVA callbacks
  private onChange = (_: any) => { };
  private onTouched = () => { };

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngAfterViewInit() {
    const control = this.ngControl?.control;
    if (!control) return;

    // Single subscription with automatic cleanup
    control.events.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.statusSignal.set(control.status);
      this.errorsSignal.set(control.errors);
      this.isTouched.set(control.touched);
      this.isDirty.set(control.dirty);
    });

    // Set initial values
    this.statusSignal.set(control.status);
    this.errorsSignal.set(control.errors);
  }

  // Computed signals
  showErrors = computed(() =>
    (this.isTouched() || this.isDirty()) &&
    this.statusSignal() === 'INVALID'
  );

  errorMessage = computed(() => {
    const errors = this.errorsSignal();
    if (!errors) return '';

    const errorKey = Object.keys(errors)[0];
    return this.errorMessages()[errorKey]
      || errors[errorKey]?.message
      || 'Invalid value';
  });

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // Event handlers
  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value.set(inputValue);
    this.onChange(inputValue);
    this.isDirty.set(true);
  }

  onBlur(): void {
    this.isTouched.set(true);
    this.onTouched();
  }
}
