import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer } from '../../services/customer';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.scss'],
  imports: [CommonModule, TableModule, FormsModule, ButtonModule],
})
export class CustomerList implements OnInit {
  customers: Customer[] = [];
  totalRecords = 0;
  loading = true;

  filterName = '';
  filterState = '';

  limit = 10;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe((customers) => {
      this.customers = customers;
      this.totalRecords = customers.length;
      this.loading = false;
    });
  }

  onFilterChange(): void {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe((customers) => {
      const name = this.filterName.toLowerCase();
      const state = this.filterState.toLowerCase();

      this.customers = customers.filter(
        (c) =>
          (!name || c.name.toLowerCase().includes(name)) &&
          (!state || c.state.toLowerCase().includes(state))
      );

      this.totalRecords = this.customers.length;
      this.loading = false;
    });
  }
}
