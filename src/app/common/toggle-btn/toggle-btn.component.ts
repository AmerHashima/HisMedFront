import { Component, input, signal, computed } from '@angular/core';
import {
  ControlValueAccessor,
} from '@angular/forms';
import { Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
@Component({
  selector: 'app-toggle-btn',
  imports: [],
  templateUrl: './toggle-btn.component.html',
  styleUrl: './toggle-btn.component.scss',
})
export class ToggleBtnComponent implements ControlValueAccessor {
  // Inputs
  label = input<string>('Enable this setting');
  id = input<string>('privacy-toggle-' + Math.random().toString(36).slice(2, 9));
  disabled = input<boolean>(false);

  // Internal state
  checked = signal<boolean>(false);
  // isTouched = signal<boolean>(false);

  // CVA callbacks
  onChange: (value: boolean) => void = () => { };
  onTouched: () => void = () => { };

  // Computed for template
  isDisabled = computed(() => this.disabled() || false);

  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

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
    // this.isTouched.set(true);
    this.onTouched();
  }

  onBlur(): void {
    // this.isTouched.set(true);
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
