import { AbstractControl, ValidationErrors } from '@angular/forms';

export function timeRangeValidator(group: AbstractControl): ValidationErrors | null {

  const start = group.get('startTime')?.value;
  const end = group.get('endTime')?.value;

  // 🟢 Important: stop if values are empty
  if (!start || !end) return null;

  const convertToMinutes = (time: string) => {

    if (!time) return 0;

    const [timePart, modifier] = time.trim().split(/\s+/);
    const [h, m] = timePart.split(':');

    let hours = Number(h);
    const minutes = Number(m);

    const mod = modifier?.toUpperCase();

    if (mod === 'PM' && hours < 12) hours += 12;
    if (mod === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const startMinutes = convertToMinutes(start);
  const endMinutes = convertToMinutes(end);

  if (endMinutes <= startMinutes) {

    const endControl = group.get('endTime');

    endControl?.setErrors({
      ...(endControl.errors || {}),
      invalidTimeRange: true
    });

  }

  return null;
}
