import { Component, ElementRef, forwardRef, input, output, Renderer2 } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

interface Option {
  label: string;
  value: any;
}

@Component({
  selector: 'spk-ng-select',
  standalone: true,
  imports: [NgSelectModule, FormsModule, CommonModule],
  templateUrl: './spk-ng-select.component.html',
  styleUrl: './spk-ng-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SpkNgSelectComponent),
      multi: true
    }
  ]
})
export class SpkNgSelectComponent implements ControlValueAccessor {
  // ────────────────────────────────────────────────
  // Signal Inputs
  // ────────────────────────────────────────────────
  label = input<string>('');
  options = input<Option[]>([]);
  id = input<string>('');
  mainClass = input<string>('');
  selectClass = input<string>('');
  maxSelectedItems = input<number | undefined>(undefined);
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
  change = output<any>();
  selectedChange = output<any>();

  // ────────────────────────────────────────────────
  // Public properties for template access
  // ────────────────────────────────────────────────
  value: any = null;           // public – used in template with ngModel

  // CVA callbacks (public so template can call onTouched())
  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  // ────────────────────────────────────────────────
  // ControlValueAccessor
  // ────────────────────────────────────────────────
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Input signal is read-only → form disable is handled by [disabled]
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
}
