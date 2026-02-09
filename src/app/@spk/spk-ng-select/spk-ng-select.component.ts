// import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { NgSelectModule } from '@ng-select/ng-select';

// interface Option {
//   label: string; // Adjust according to your option structure
//   value: any;    // Use the appropriate type based on your data
// }
// @Component({
//   selector: 'spk-ng-select',
//   standalone: true,
//   imports: [NgSelectModule,FormsModule],
//   templateUrl: './spk-ng-select.component.html',
//   styleUrl: './spk-ng-select.component.scss'
// })
// export class SpkNgSelectComponent {
//   @Input() options: any = []; // Options for the select
//   @Input() defaultValue: any=[];   // Default value for the select
//   @Input() id: string='';       // Additional classes
//   @Input() mainClass: string='';       // Additional classes
//   @Input() maxSelectedItems!: number;       // Additional classes
//   @Input() selectClass: string='';       // Additional classes
//   @Input() disabled: boolean = false; // Disable the select
//   @Input() clearable?: boolean = true; // Allow clearing of selection
//   @Input() multiple?: boolean = false;   // Enable multiple selection
//   @Input() addTag: boolean = false;   //adding multiple selection
//   @Input() multi?: boolean = false;   // Enable multiple selection
//   @Input() searchable?: boolean = true; // Enable searching
//   @Input() hideSelected: boolean = true; // Enable searching
//   @Input() placeholder: string = ''      // Placeholder text
//   @Input() additionalProperties: { [key: string]: any } = {};
//   @Output() change: EventEmitter<Option | Option[]> = new EventEmitter(); // Emit value change
//   @Input() extraProps: any = {};
//   // @Input() extraProps: { [key: string]: any } = {};
// prop: any;
// image: any;
// @Output() selectedChange = new EventEmitter<any>(); // Emit changes in selection

// onSelectionChange(selected: any): void {
//   this.selectedChange.emit(selected);
// }
//   constructor(private renderer: Renderer2, private el: ElementRef) {}

//   ngAfterViewInit() {
//     this.applyAdditionalProperties();
//   }

//   // Apply additional properties using Renderer2
//   private applyAdditionalProperties() {
//     const selectElement = this.el.nativeElement.querySelector('ng-select');

//     if (selectElement && this.additionalProperties) {
//       Object.keys(this.additionalProperties).forEach(prop => {
//         const value = this.additionalProperties[prop];
//         if (this.isValidAttributeName(prop)) {
//           this.renderer.setAttribute(selectElement, prop, value);
//         }
//       });
//     }
//   }

//   // Example attribute validation
//   isValidAttributeName(name: string): boolean {
//     const invalidCharacters = [' ', '|', ':', '/', '\\', ';', ','];
//     return !invalidCharacters.some(char => name.includes(char));
//   }

//   onValueChange(event: any) {
//     console.log('Selected Value:', event);
//   }
// }


import { Component, ElementRef, input, output, Renderer2 } from '@angular/core';
import { ControlValueAccessor, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

// interface Option {
//   label: string;
//   value: any;
// }

@Component({
  selector: 'spk-ng-select',
  standalone: true,
  imports: [NgSelectModule, FormsModule, CommonModule],
  templateUrl: './spk-ng-select.component.html',
  styleUrl: './spk-ng-select.component.scss',

})
export class SpkNgSelectComponent<T = any> implements ControlValueAccessor {  // ────────────────────────────────────────────────
  // Signal Inputs
  // ────────────────────────────────────────────────
  label = input<string>('');
  // options = input<Option[]>([]);
  options = input<T[]>([]);
  id = input<string>('');
  mainClass = input<string>('');
  selectClass = input<string>('');
  maxSelectedItems = input<number>(999);
  disabled = input<boolean>(false);
  clearable = input<boolean>(true);
  multiple = input<boolean>(false);
  addTag = input<boolean | ((term: string) => any)>(false);
  searchable = input<boolean>(true);
  hideSelected = input<boolean>(true);
  placeholder = input<string>('Select...');
  additionalProperties = input<Record<string, any>>({});
  bindLabel = input<string>('label');
  bindValue = input<string>('value');
  multi = input<boolean>(false, { alias: 'multi' });

  // ────────────────────────────────────────────────
  // Outputs
  // ────────────────────────────────────────────────
  change = output<T>();
  selectedChange = output<T>();

  // ────────────────────────────────────────────────
  // Public properties for template access
  // ────────────────────────────────────────────────
  value: any = null;           // public – used in template with ngModel

  // CVA callbacks (public so template can call onTouched())
  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };


  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  // ────────────────────────────────────────────────
  // ControlValueAccessor
  // ────────────────────────────────────────────────
  writeValue(value: any): void {
    this.value = value;
    if (value !== undefined && value !== null) {
      // notify Angular forms
      this.onChange(value);

      // trigger your custom outputs
      this.change.emit(value);
      this.selectedChange.emit(value);
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  // ────────────────────────────────────────────────
  // Change handler (called from template)
  // ────────────────────────────────────────────────
  handleSelectionChange(selected: any): void {
    this.value = selected;
    this.onChange(selected);
    this.onTouched();
    this.change.emit(selected);
    this.selectedChange.emit(selected);
  }

  // ────────────────────────────────────────────────
  // Additional properties (unchanged)
  // ────────────────────────────────────────────────
  ngAfterViewInit() {
    this.applyAdditionalProperties();
  }

  private applyAdditionalProperties() {
    const selectElement = this.el.nativeElement.querySelector('ng-select');
    if (!selectElement || !this.additionalProperties()) return;

    Object.entries(this.additionalProperties()).forEach(([prop, value]) => {
      if (this.isValidAttributeName(prop)) {
        this.renderer.setAttribute(selectElement, prop, String(value));
      }
    });
  }

  private isValidAttributeName(name: string): boolean {
    const invalid = [' ', '|', ':', '/', '\\', ';', ','];
    return !invalid.some(char => name.includes(char));
  }

  get control() {
    return this.ngControl?.control;
  }

  get showErrors(): boolean {
    return !!this.control && this.control.touched && this.control.invalid;
  }

  get errorMessages(): string[] {
    if (!this.control?.errors) return [];
    return Object.keys(this.control.errors).map(key => {
      const err = this.control!.errors![key];
      return this.getFriendlyError(key, err);
    });
  }

  private getFriendlyError(key: string, errorObj: any): string {
    switch (key) {
      case 'required':
        return 'Selection is required';
      default:
        return 'Invalid selection';
    }
  }
}
