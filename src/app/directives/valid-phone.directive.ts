import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
} from '@angular/forms';

@Directive({
  selector: '[appValidPhone]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValidPhoneDirective,
      multi: true,
    },
  ],
})
export class ValidPhoneDirective implements Validator {
  @Input() contactType: string | null = null;

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value || !this.contactType) return null;

    const cleaned = control.value.replace(/\D/g, '');

    if (this.contactType === 'Whatsapp' && cleaned.length !== 11) {
      return { invalidPhone: true };
    }

    if (
      (this.contactType === 'Fixo' || this.contactType === 'Residencial') &&
      cleaned.length !== 10
    ) {
      return { invalidPhone: true };
    }

    return null;
  }
}
