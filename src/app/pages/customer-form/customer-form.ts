import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  templateUrl: './customer-form.html',
  styleUrls: ['./customer-form.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    InputTextModule,
    InputMaskModule,
    DatePickerModule,
    SelectModule,
    ButtonModule,
  ],
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  countries: {
    name: string;
    code: string;
    states: { name: string; code: string }[];
  }[] = [];
  statesList: { name: string; code: string }[] = [];
  today: Date = new Date();
  contactMask: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: [''],
      birthDate: ['', Validators.required],
      phone: [''],
      contactType: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.http.get<any[]>('countries.json').subscribe((data) => {
      this.countries = data;
    });

    this.onFormChanges();
  }

  onFormChanges(): void {
    this.customerForm.get('country')?.valueChanges.subscribe((code: string) => {
      const country = this.countries.find((c) => c.code === code);
      this.statesList = country?.states || [];

      if (code === 'BR') {
        this.customerForm.get('cpf')?.setValidators([Validators.required]);
      } else {
        this.customerForm.get('cpf')?.clearValidators();
      }

      this.customerForm.get('cpf')?.updateValueAndValidity();
    });

    this.customerForm
      .get('contactType')
      ?.valueChanges.subscribe((type: string) => {
        if (type === 'Whatsapp' || type === 'Celular') {
          this.contactMask = '(99) 99999-9999';
        } else {
          this.contactMask = '(99) 9999-9999';
        }
      });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      console.log('Cliente salvo:', this.customerForm.value);
    } else {
      this.customerForm.markAllAsTouched();
    }
  }
}
