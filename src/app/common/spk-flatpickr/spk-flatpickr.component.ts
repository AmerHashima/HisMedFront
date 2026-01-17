import { Component, forwardRef, input, computed } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FlatpickrModule, FlatpickrDefaults } from 'angularx-flatpickr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'spk-flatpickr',
  standalone: true,
  imports: [
    FlatpickrModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './spk-flatpickr.component.html',
  providers: [
    FlatpickrDefaults,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SpkFlatpickrComponent),
      multi: true
    }
  ]
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

    // Decide what to emit based on convertModelValue and mode
    let emitValue: Date | Date[] | null = newValue;

    if (this.convertModelValue()) {
      if (Array.isArray(newValue)) {
        // For range → take first date, for multiple → first or whole array?
        // Here we follow your original logic (take first)
        emitValue = newValue.length > 0 ? newValue[0] : null;
      }
    }

    this.onChange(emitValue);
    this.onTouched();
  }
}
