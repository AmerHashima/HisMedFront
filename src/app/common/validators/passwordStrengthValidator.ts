import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordStrengthValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    if (!value) return null; 

    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

    const valid =
      hasLowerCase &&
      hasUpperCase &&
      hasDigit &&
      hasSpecialChar;

    return valid
      ? null
      : {
        passwordStrength: {
          hasLowerCase,
          hasUpperCase,
          hasDigit,
          hasSpecialChar
        }
      };
  };
};
