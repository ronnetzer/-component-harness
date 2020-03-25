import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { By } from '@angular/platform-browser';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventEmitter } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LoginModule } from './login.module';
import { LoginComponent, User } from './login.component';
import { LoginComponentHarness } from './login.harness.spec';

const testCountries = ['Israel', 'US'];

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, LoginModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show countries from input in select dropdown', () => {
    const select = fixture.debugElement.query(By.directive(MatSelect));

    component.countries = testCountries;
    fixture.detectChanges();

    (select.componentInstance as MatSelect).open();
    fixture.detectChanges();

    const optionTexts = fixture.debugElement
      .queryAll(By.directive(MatOption))
      .map(option => (option.componentInstance as MatOption).value);

    expect(optionTexts).toEqual(testCountries);
  });

  it('should set first country as selected on init', () => {
    const spy = spyOn(component, 'setDefaultCountry').and.callThrough();
    component.countries = testCountries;
    fixture.detectChanges();

    component.ngOnInit();

    const select = fixture.debugElement.query(By.directive(MatSelect));
    const option = (select.componentInstance as MatSelect).selected as MatOption;

    expect(spy).toHaveBeenCalled();
    expect(option.value).toEqual(testCountries[0]);
  });

  it('should allow to submit if name, email and password are valid', () => {
    const spy = spyOn<EventEmitter<any>>(component.submit, 'emit');
    const submitButton = fixture.debugElement
      .queryAll(By.css('button.submit'))
      .find(debugElements => debugElements.nativeElement.innerText === 'Submit');
    const formData: Partial<User> = {
      name: 'Ron Netzer',
      email: 'ron@e-square.io',
      password: 'test'
    };

    expect(submitButton.nativeElement.disabled).toBeTruthy();

    component.form.patchValue(formData);
    fixture.detectChanges();
    submitButton.nativeElement.click();

    expect(spy).toHaveBeenCalledWith({ country: null, ...formData });
  });
});

describe('LoginComponent With Harness', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let loader: HarnessLoader;
  let loginHarness: LoginComponentHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, LoginModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    /**
     * wont work.
     * Angular does not set the proper tag name on the fixture,
     * if the component is bootstrapped directly, therefore the harness wont be found.
     * this should be used when the fixture is a host component that hosts the tested component/directive
     */
    // loginHarness = await loader.getHarness(LoginComponent);

    loginHarness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      LoginComponentHarness
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show countries from input in select dropdown', async () => {
    await loginHarness.setCountries(component, testCountries);

    expect(await loginHarness.getCountries()).toEqual(testCountries);
  });

  it('should set first country as selected on init', async () => {
    await loginHarness.setCountries(component, testCountries);

    component.ngOnInit();

    expect(await loginHarness.getSelectedCountry()).toEqual(testCountries[0]);
  });

  it('should allow to submit if name, email and password are valid', async () => {
    const spy = spyOn<EventEmitter<any>>(component.submit, 'emit');
    const formData: Partial<User> = {
      name: 'Ron Netzer',
      email: 'ron@e-square.io',
      password: 'test'
    };

    await loginHarness.fillForm(formData);
    await loginHarness.submit();

    expect(spy).toHaveBeenCalledWith({ country: null, ...formData });
  });
});
