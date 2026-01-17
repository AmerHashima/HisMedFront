import { Component, input, computed } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
@Component({
  selector: 'spk-flatpickr',
  standalone: true,
  imports: [
    FlatpickrModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './spk-flatpickr.component.html',
})
export default class SpkFlatpickrComponent implements ControlValueAccessor {
  // ─── Input Signals ────────────────────────────────────────────────
  label = input<string>('');
  altInput = input<boolean>(false);
  convertModelValue = input<boolean>(true);
  enableTime = input<boolean>(true);
  noCalendar = input<boolean>(false);
  inline = input<boolean>(false);
  class = input<string>('');
  dateFormat = input<string>('');
  placeholder = input<string>('');
  mode = input<'single' | 'range' | 'multiple'>('single');

  // ─── Component State ──────────────────────────────────────────────
  value: Date | Date[] | null = null;
  disabled = false;

  // ControlValueAccessor callbacks
  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  // ─── Computed / Helpers ───────────────────────────────────────────
  // Optional: you can expose a computed class string if needed
  readonly inputClasses = computed(() => {
    const base = 'form-control form-control-lg';
    const extra = this.class() ? ` ${this.class()}` : '';
    return base + extra;
  });

  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  // ─── CVA Methods ──────────────────────────────────────────────────
  writeValue(value: Date | Date[] | null): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ─── Value Change Handler ─────────────────────────────────────────
  onValueChange(newValue: Date | Date[] | null): void {
    this.value = newValue;

    let emitValue: Date | Date[] | null = newValue;

    if (this.convertModelValue()) {
      if (Array.isArray(newValue)) {
        emitValue = newValue.length > 0 ? newValue[0] : null;
      }
    }

    this.onChange(emitValue);
    this.onTouched();
  }

  get control() {
    return this.ngControl?.control;
  }

  get showErrors(): boolean {
    return !!this.control && this.control.touched && this.control.invalid;
  }

  get errorMessagesList(): string[] {
    if (!this.control?.errors) return [];
    const errors = this.control.errors;
    return Object.keys(errors).map(key => {
      switch (key) {
        case 'required':
          return `This field is required`;
        default:
          return `${key} error`;
      }
    });
  }
}
