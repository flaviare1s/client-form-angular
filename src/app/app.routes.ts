import { Routes } from '@angular/router';
import { CustomerFormComponent } from './pages/customer-form/customer-form';
import { CustomerList } from './pages/customer-list/customer-list';

export const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers', component: CustomerList },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/edit/:id', component: CustomerFormComponent },
  { path: '**', redirectTo: 'customers' },
];

