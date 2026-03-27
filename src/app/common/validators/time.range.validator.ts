import { AbstractControl, ValidationErrors } from '@angular/forms';

export function timeRangeValidator(group: AbstractControl): ValidationErrors | null {

  const start = group.get('startTime')?.value;
  const end = group.get('endTime')?.value;

  if (!start || !end) return null;

  const parseTime = (time: string) => {
    const [timePart, modifier] = time.trim().split(/\s+/);
    const [h, m] = timePart.split(':');

    let hours = Number(h);
    const minutes = Number(m);
    const mod = modifier?.toUpperCase(); // AM / PM

    // 🔥 Normalize 12 edge cases
    if (mod === 'AM' && hours === 12) hours = 0;
    if (mod === 'PM' && hours < 12) hours += 12;

    return {
      totalMinutes: hours * 60 + minutes,
      period: mod // keep original period
    };
  };

  const startParsed = parseTime(start);
  const endParsed = parseTime(end);

  const endControl = group.get('endTime');

  if (startParsed.period !== endParsed.period) {

    const is12Boundary =
      start.includes('12') || end.includes('12');

    if (!is12Boundary) {
      endControl?.setErrors({
        ...(endControl.errors || {}),
        invalidPeriod: true
      });
      return { invalidPeriod: true };
    }
  }

  if (endParsed.totalMinutes <= startParsed.totalMinutes) {
    endControl?.setErrors({
      ...(endControl.errors || {}),
      invalidTimeRange: true
    });
    return { invalidTimeRange: true };
  }

  if (endControl?.hasError('invalidTimeRange') || endControl?.hasError('invalidPeriod')) {
    const errors = { ...(endControl.errors || {}) };
    delete errors['invalidTimeRange'];
    delete errors['invalidPeriod'];

    if (Object.keys(errors).length === 0) {
      endControl.setErrors(null);
    } else {
      endControl.setErrors(errors);
    }
  }

  return null;
}
