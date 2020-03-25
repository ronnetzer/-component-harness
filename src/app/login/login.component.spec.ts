import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent, User } from './login.component';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { LoginModule } from "./login.module";
import { Component, EventEmitter, Input } from "@angular/core";
import { By } from "@angular/platform-browser";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/core";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { LoginComponentHarness } from "./login.harness.spec";

const countries = ['Israel', 'USA'];

@Component({
  template: `
    <app-login [countries]="countries"></app-login>`
})
class HostComponent {
  countries = countries;
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [
        NoopAnimationsModule,
        LoginModule
      ]
    })
      .compileComponents()
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.debugElement.query(By.directive(LoginComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show countries from input in select dropdown', () => {
    const select = fixture.debugElement.query(By.directive(MatSelect));

    (select.componentInstance as MatSelect).open();
    fixture.detectChanges();

    const optionTexts = fixture.debugElement.queryAll(By.directive(MatOption)).map(option => (option.componentInstance as MatOption).value);

    expect(optionTexts).toEqual(countries);
  });

  it('should set first country as selected if possible', () => {
    const spy = spyOn(component, 'setDefaultCountry').and.callThrough();

    component.ngOnInit();

    const select = fixture.debugElement.query(By.directive(MatSelect));
    const option = (select.componentInstance as MatSelect).selected as MatOption;

    expect(spy).toHaveBeenCalled();
    expect(option.value).toEqual(countries[0]);
  });

  it('should allow to submit if name, email and password are valid', () => {
    const formData: User = {
      name: 'Ron Netzer',
      email: 'ron@e-square.io',
      password: 'test'
    };
    const spy = spyOn<EventEmitter<any>>(component.submit, 'emit');
    const submitButton = fixture.debugElement.queryAll(By.css('button')).find(debugElements => debugElements.nativeElement.innerText === 'Submit');

    component.form.patchValue(formData);
    fixture.detectChanges();
    submitButton.nativeElement.click();

    expect(spy).toHaveBeenCalledWith({ country: countries[0], ...formData });
  });

});


describe('LoginComponent With Harness', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: LoginComponent;
  let loader: HarnessLoader;
  let loginHarness: LoginComponentHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [
        NoopAnimationsModule,
        LoginModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.debugElement.query(By.directive(LoginComponent)).componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    loginHarness = await loader.getHarness(LoginComponentHarness);
  });


  it('should show countries from input in select dropdown', async () => {
    const optionTexts = await loginHarness.getCountries();

    expect(optionTexts).toEqual(countries);
  });

  it('should set first country as selected if possible', async () => {
    const selectedOption = await loginHarness.getSelectedCountry();

    expect(selectedOption).toEqual(countries[0]);
  });


  it('should allow to submit if name, email and password are valid', async () => {
    const formData: User = {
      name: 'Ron Netzer',
      country: countries[1],
      email: 'ron@e-square.io',
      password: 'test'
    };
    const spy = spyOn<EventEmitter<any>>(component.submit, 'emit');

    await loginHarness.fillForm(formData);
    await loginHarness.submit();

    expect(spy).toHaveBeenCalledWith({ country: countries[1], ...formData });
  });

});
