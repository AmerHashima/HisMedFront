// import { Component, input, signal, computed } from '@angular/core';
// import {
//   ControlValueAccessor,
//   NG_VALUE_ACCESSOR,
// } from '@angular/forms';

// @Component({
//   selector: 'app-checkbox',
//   imports: [],
//   templateUrl: './checkbox.component.html',
//   styleUrl: './checkbox.component.scss',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: CheckboxComponent,
//       multi: true,
//     },
//   ],
// })
// export class CheckboxComponent implements ControlValueAccessor {
//   // Inputs
//   label = input<string>('Checkbox');
//   id = input<string>('');   // optional – auto-generated if empty
//   disabled = input<boolean>(false);

//   // Internal signals
//   checked = signal<boolean>(false);
//   isTouched = signal<boolean>(false);

//   // Auto-generate unique ID if not provided
//   effectiveId = computed(() => {
//     const userId = this.id();
//     return userId || `checkbox-${Math.random().toString(36).substring(2, 11)}`;
//   });

//   // CVA callbacks
//   onChange: (value: boolean) => void = () => { };
//   onTouched: () => void = () => { };

//   writeValue(value: boolean | null | undefined): void {
//     this.checked.set(!!value);
//   }

//   registerOnChange(fn: (value: boolean) => void): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: () => void): void {
//     this.onTouched = fn;
//   }

//   setDisabledState(isDisabled: boolean): void {
//     // Input already handles it, but can sync if needed
//   }

//   toggle(): void {
//     if (this.disabled()) return;

//     this.checked.update(v => !v);
//     this.onChange(this.checked());
//     this.isTouched.set(true);
//     this.onTouched();
//   }

//   onBlur(): void {
//     this.isTouched.set(true);
//     this.onTouched();
//   }
// }

import { Component, computed, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface CheckboxOption {
  label: string;
  value: string;   // or number if your IDs are numeric
}

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxComponent,
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  // Inputs
  options = input.required<CheckboxOption[]>();
  label = input<string>('Select options');
  disabled = input<boolean>(false);

  // Internal state
  selectedValues = signal<string[]>([]);   // the array we expose to the form
  isTouched = signal<boolean>(false);

  // CVA callbacks
  onChange: (values: string[]) => void = () => { };
  onTouched: () => void = () => { };

  isDisabled = computed(() => this.disabled());

  writeValue(value: string[] | null | undefined): void {
    this.selectedValues.set(value ?? []);
  }

  registerOnChange(fn: (values: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled via input
  }

  toggle(optionValue: string): void {
    if (this.isDisabled()) return;

    this.selectedValues.update(current => {
      if (current.includes(optionValue)) {
        return current.filter(v => v !== optionValue);
      } else {
        return [...current, optionValue];
      }
    });

    this.onChange(this.selectedValues());
    this.isTouched.set(true);
    this.onTouched();
  }

  isChecked(value: string): boolean {
    return this.selectedValues().includes(value);
  }

  onBlur(): void {
    this.isTouched.set(true);
    this.onTouched();
  }
}
