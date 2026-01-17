import { Component, signal, computed, input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl:"./input.component.html" ,
  styleUrl:"./input.component.scss",
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: InputComponent,
    multi: true
  }]
})
export class InputComponent implements ControlValueAccessor {
  // Inputs (signal-based)
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  icon = input<string | undefined>();
  errorMessages = input<Record<string, string>>({});

  // Internal state
  value = signal<string>('');
  isDisabled = signal<boolean>(false);
  isTouched = signal<boolean>(false);

  private control?: FormControl;


  // CVA callbacks
  onChange: (v: string) => void = () => { };
  onTouched: () => void = () => { };

  // Validation computed
  showErrors = computed(() =>
    this.isTouched() && !!this.control?.invalid
  );

  getErrorMessage = computed(() => {
    if (!this.control?.errors) return '';
    const key = Object.keys(this.control.errors)[0];
    return this.errorMessages()[key] || 'Invalid value';
  });


  constructor() { }

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

  onInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }

  onBlur(): void {
    this.isTouched.set(true);
    this.onTouched();
  }
}
