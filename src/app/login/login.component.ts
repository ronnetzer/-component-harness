import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';

export interface User {
  name: string;
  email: string;
  password: string;
  country: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    country: new FormControl(),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required])
  });

  @Input() countries: string[] = [];

  @Output() submit: EventEmitter<User> = new EventEmitter<User>();

  @ViewChild(MatSelect, { static: true }) select: MatSelect;

  constructor() {}

  ngOnInit(): void {
    this.setDefaultCountry(this.countries);
  }

  setDefaultCountry(countries: string[]): void {
    if (countries.length) {
      this.form.get('country').patchValue(countries[0]);
    }
  }

  submitForm(): void {
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    }
  }
}
