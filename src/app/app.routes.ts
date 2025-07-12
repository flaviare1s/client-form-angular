import { Routes } from '@angular/router';
import { CustomerFormComponent } from './pages/customer-form/customer-form';
import { CustomerList } from './pages/customer-list/customer-list';

export const routes: Routes = [
  { path: 'register', component: CustomerFormComponent },
  { path: '', component: CustomerList },
];
