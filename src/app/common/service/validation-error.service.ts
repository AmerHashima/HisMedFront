import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationErrorService {

  constructor() { }
  handleApiErrors(
    form: FormGroup,
    error: any,
    backendErrorKeyMap: Record<string, string[]>,
    apiFieldErrors: Record<string, string>
  ): void {

    Object.keys(apiFieldErrors).forEach(k => delete apiFieldErrors[k]);

    if (!error) return;

    // Object-based errors
    if (error && typeof error === 'object') {
      Object.keys(error).forEach((key) => {

        const messages = Array.isArray(error[key])
          ? error[key].join(', ')
          : error[key];

        const formField = this.mapBackendFieldToFormField(key, backendErrorKeyMap);

        const control = form.get(formField);

        if (control) {
          apiFieldErrors[formField] = messages;

          control.setErrors({
            ...(control.errors ?? {}),
            backendError: true
          });

          control.markAsTouched();
        } else {
          form.setErrors({ backendError: messages });
        }
      });

      return;
    }

    // String fallback
    if (typeof error === 'string') {
      form.setErrors({ backendError: error });
    }
  }

  clearErrors(form: FormGroup, apiFieldErrors: Record<string, string>) {
    Object.keys(apiFieldErrors).forEach(k => delete apiFieldErrors[k]);

    form.setErrors(null);

    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (!control) return;

      control.setErrors(null);
      control.markAsUntouched();
      control.markAsPristine();
    });
  }

  private mapBackendFieldToFormField(
    field: string,
    backendErrorKeyMap: Record<string, string[]>
  ): string {

    const found = Object.keys(backendErrorKeyMap).find(f =>
      backendErrorKeyMap[f].includes(field)
    );

    return found ?? field;
  }
}
