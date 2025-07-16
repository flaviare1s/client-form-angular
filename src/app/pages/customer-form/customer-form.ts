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
import { ValidPhoneDirective } from '../../directives/valid-phone.directive';
import { CustomerService, Customer } from '../../services/customer';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

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
    ValidPhoneDirective
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
  editMode = false;
  customerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private customerService: CustomerService,
    public router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
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

    this.customerId = this.route.snapshot.paramMap.get('id');
    this.editMode = !!this.customerId;

    if (this.editMode && this.customerId) {
      this.customerService
        .getCustomerById(this.customerId)
        .subscribe((customer) => {
          this.customerForm.patchValue({
            ...customer,
            birthDate: new Date(customer.birthDate),
          });
        });
    }

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
        } else if (type === 'Fixo' || type === 'Residencial') {
          this.contactMask = '(99) 9999-9999';
        } else {
          this.contactMask = '';
        }

        const phoneControl = this.customerForm.get('phone');
        const currentValue = phoneControl?.value;
        phoneControl?.setValue(currentValue);
      });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const customer: Customer = this.customerForm.value;

      if (this.editMode && this.customerId) {
        this.customerService
          .updateCustomer(this.customerId, customer)
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Cliente atualizado com sucesso!',
            });
            this.router.navigate(['/']);
          });
      } else {
        this.customerService.addCustomer(customer).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Cliente adicionado com sucesso!',
          });
          this.router.navigate(['/']);
        });
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos corretamente!',
      });
      this.customerForm.markAllAsTouched();
    }
  }
}
