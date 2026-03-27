import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateRangeValidator(group: AbstractControl): ValidationErrors | null {

  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;

  if (!start || !end) return null;

  const startDate = new Date(start);
  const endDate = new Date(end);

  const endControl = group.get('endDate');

  if (endDate < startDate) {
    endControl?.setErrors({
      ...(endControl.errors || {}),
      invalidDateRange: true
    });

    return { invalidDateRange: true };
  }

  // ✅ clear error if fixed
  if (endControl?.hasError('invalidDateRange')) {
    const errors = { ...(endControl.errors || {}) };
    delete errors['invalidDateRange'];

    if (Object.keys(errors).length === 0) {
      endControl.setErrors(null);
    } else {
      endControl.setErrors(errors);
    }
  }

  return null;
}
