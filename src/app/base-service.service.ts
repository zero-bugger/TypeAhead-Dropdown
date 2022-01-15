import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseServiceService {
  private option = [
    'Gina',
    'Williams',
    'Jake Williams',
    'Jamie John',
    'John Doe',
    'Jeff Steward',
    'Paula M. Keith',
  ];
  constructor() {}

  public loadOptionValues(search = ''): Observable<string[]> {
    if (search === '@') {
      return of(this.option);
    }
    for (let i = 0; i < this.option.length; i++) {
      if (
        String(search.substr(1)).toLowerCase() ===
        String(this.option[i]).toLowerCase()
      ) {
        return of(Array(this.option[i]));
      }
    }
    return of([]);
  }
}
