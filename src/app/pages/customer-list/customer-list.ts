import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.scss'],
  imports: [CommonModule, FormsModule, TableModule, ButtonModule],
})
export class CustomerList {
  filterName = '';
  filterState = '';
  customers = [];
  limit = 10;
  totalRecords = 0;
  loading = false;

  onFilterChange() {
    // lógica de filtro
  }

  onPageChange(event: any) {
    // lógica de paginação
  }
}
