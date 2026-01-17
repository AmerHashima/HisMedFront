import { Component, input, signal, computed } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-toggle-btn',
  imports: [],
  templateUrl: './toggle-btn.component.html',
  styleUrl: './toggle-btn.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ToggleBtnComponent,
      multi: true,
    },
  ],
})
export class ToggleBtnComponent implements ControlValueAccessor {
  // Inputs
  label = input<string>('Enable this setting');
  id = input<string>('privacy-toggle-' + Math.random().toString(36).slice(2, 9)); // unique if not provided
  disabled = input<boolean>(false);

  // Internal state
  checked = signal<boolean>(false);
  isTouched = signal<boolean>(false);

  // CVA callbacks
  onChange: (value: boolean) => void = () => { };
  onTouched: () => void = () => { };

  // Computed for template
  isDisabled = computed(() => this.disabled() || false);

  writeValue(value: boolean | null | undefined): void {
    this.checked.set(!!value); // convert null/undefined → false
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // handled via input + computed — but we can sync if needed
  }

  toggle(): void {
    if (this.isDisabled()) return;

    this.checked.update(v => !v);
    this.onChange(this.checked());
    this.isTouched.set(true);
    this.onTouched();
  }

  onBlur(): void {
    this.isTouched.set(true);
    this.onTouched();
  }
}
