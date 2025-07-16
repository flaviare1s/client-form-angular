import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer } from '../../services/customer';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CustomerStateService } from '../../services/customer-state';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog';


@Component({
  selector: 'app-customer-list',
  standalone: true,
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.scss'],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogComponent,
  ],
})
export class CustomerList implements OnInit {
  customers: Customer[] = [];
  totalRecords = 0;
  loading = true;

  filterName = '';
  filterState = '';

  limit = 10;

  showDialog = false;
  selectedCustomer: Customer | null = null;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private customerStateService: CustomerStateService
  ) {}

  ngOnInit(): void {
    this.customerStateService.state$.subscribe((state) => {
      this.filterName = state.name;
      this.filterState = state.state;
      this.applyFilters();
    });
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe((customers) => {
      this.customers = customers;
      this.totalRecords = customers.length;
      this.loading = false;
    });
  }

  applyFilters(): void {
    const name = this.filterName.toLowerCase();
    const state = this.filterState.toLowerCase();

    this.loading = true;
    this.customerService.getAllCustomers().subscribe((customers) => {
      this.customers = customers.filter(
        (c) =>
          (!name || c.name.toLowerCase().includes(name)) &&
          (!state || c.state.toLowerCase().includes(state))
      );

      this.totalRecords = this.customers.length;
      this.loading = false;
    });
  }

  onFilterChange(): void {
    this.customerStateService.updateState({
      name: this.filterName,
      state: this.filterState,
    });

    this.applyFilters();
  }

  onEdit(customer: Customer): void {
    console.log('Editar ID:', customer.id);
    this.router.navigate(['/customers/edit', customer.id]);
  }

  onDelete(customer: Customer): void {
    this.selectedCustomer = customer;
    this.showDialog = true;
  }

  confirmDelete(): void {
    if (this.selectedCustomer) {
      this.customerService
        .deleteCustomer(this.selectedCustomer.id)
        .subscribe(() => {
          this.loadCustomers();
          this.showDialog = false;
        });
    }
  }

  onNewCustomer(): void {
    this.router.navigate(['/customers/new']);
  }
}
