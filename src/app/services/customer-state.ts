import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CustomerFilterState {
  name: string;
  state: string;
}

const STORAGE_KEY = 'customerFilterState';

@Injectable({ providedIn: 'root' })
export class CustomerStateService {
  private _initialState: CustomerFilterState = {
    name: '',
    state: '',
  };

  private _stateSubject = new BehaviorSubject<CustomerFilterState>(
    this.getStoredState()
  );

  readonly state$ = this._stateSubject.asObservable();

  updateState(newState: CustomerFilterState) {
    this._stateSubject.next(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }

  private getStoredState(): CustomerFilterState {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : this._initialState;
  }
}
