import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Observable, fromEvent, concat } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { BaseServiceService } from '../base-service.service';

@Component({
  selector: 'app-typeahead-dropdown',
  templateUrl: './typeahead-dropdown.component.html',
  styleUrls: ['./typeahead-dropdown.component.scss'],
})
export class TypeaheadDropdownComponent implements OnInit, AfterViewInit {
  options$!: Observable<string[]>;
  values!: string[];
  search$!: Observable<string[]>;
  inputValue: string = '';
  showDropdown: boolean = false;
  colorChange!: boolean;
  arrowkeyLocation: number = 0;
  hover: boolean = true;
  mouseover: boolean = false;

  constructor(private baseService: BaseServiceService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const input: any = document.getElementById('search');
    const initialValues$ = this.baseService.loadOptionValues();
    this.search$ = fromEvent<any>(input, 'keyup').pipe(
      map((event) => event.target.value),
      debounceTime(400),
      switchMap((searchTerm) => this.baseService.loadOptionValues(searchTerm)),
      tap((data) => {
        if (data.length != 0) {
          this.colorChange = false;
          this.showDropdown = true;
        }
      }),
      distinctUntilChanged()
    );
    this.options$ = concat(initialValues$, this.search$);
    this.options$.subscribe((data) => {
      this.values = data;
    });
  }

  selectValue(value: string): void {
    this.inputValue = value;
    this.colorChange = true;
    this.showDropdown = false;
  }

  onKeyPressed(event: KeyboardEvent): void {
    const str = (event.target as HTMLInputElement).value.substr(1);
    this.hover = false;
    console.log(event);
    switch (event.code) {
      case 'ArrowUp':
        console.log('up');
        this.arrowkeyLocation--;
        break;

      case 'ArrowDown':
        console.log('down');
        this.arrowkeyLocation++;
        break;

      case 'Enter':
        this.inputValue =
          this.arrowkeyLocation &&
          this.arrowkeyLocation <= 7 &&
          this.arrowkeyLocation >= 0
            ? this.values[this.arrowkeyLocation]
            : str.charAt(0).toUpperCase() + str.slice(1);
        this.showDropdown = false;
        this.colorChange = true;
        this.arrowkeyLocation = 0;
        break;
    }
  }

  reset(): void {
    this.inputValue = '';
    this.showDropdown = false;
    this.colorChange = false;
  }
}
