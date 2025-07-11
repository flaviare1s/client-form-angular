import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Customer {
  id: number;
  name: string;
  email: string;
  cpf: string;
  birthDate: string;
  phone: string;
  contactType: string;
  country: string;
  state: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'http://localhost:3000/customers';

  constructor(private http: HttpClient) {}

  getCustomers(
    filterName?: string,
    filterState?: string,
    page: number = 1,
    limit: number = 5
  ): Observable<{ customers: Customer[]; total: number }> {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    if (filterName) {
      params = params.set('name_like', filterName);
    }
    if (filterState) {
      params = params.set('state', filterState);
    }

    return this.http
      .get<Customer[]>(this.apiUrl, { params, observe: 'response' })
      .pipe(
        map((resp) => {
          const totalCount = Number(resp.headers.get('X-Total-Count')) || 0;
          return {
            customers: resp.body || [],
            total: totalCount,
          };
        })
      );
  }
}
