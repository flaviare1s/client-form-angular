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

  page = 1;
  limit = 10;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService
      .getCustomers(this.filterName, this.filterState, this.page, this.limit)
      .subscribe((res) => {
        this.customers = res.customers;
        this.totalRecords = res.total;
        this.loading = false;
      });
  }

  onPageChange(event: any) {
    this.page = event.page + 1;
    this.loadCustomers();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadCustomers();
  }
}
