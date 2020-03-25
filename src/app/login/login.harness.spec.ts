import { AsyncFactoryFn, ComponentHarness } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { OptionHarnessFilters } from "@angular/material/core/testing";
import { MatButtonHarness } from "@angular/material/button/testing";
import { MatFormFieldControlHarness, MatFormFieldHarness } from "@angular/material/form-field/testing";
import { User } from "./login.component";
import { MatInputHarness } from "@angular/material/input/testing";


export class LoginComponentHarness extends ComponentHarness {
  static hostSelector = 'app-login';

  protected getCountrySelect: AsyncFactoryFn<MatSelectHarness> =
    this.locatorFor(MatSelectHarness);

  protected getSubmitButton: AsyncFactoryFn<MatButtonHarness> =
    this.locatorFor(MatButtonHarness.with({ text: 'Submit' }));

  protected getFormField = (name: string): Promise<MatFormFieldHarness> =>
    this.locatorFor(MatFormFieldHarness.with({ floatingLabelText: new RegExp(name, 'i') }))();

  async isSubmitDisabled(): Promise<boolean> {
    return this.getSubmitButton().then(button => button.isDisabled());
  }

  async submit(): Promise<void> {
    return this.getSubmitButton().then(button => button.click());
  }

  async getCountries(): Promise<ReadonlyArray<string>> {
    const select = await this.getCountrySelect();

    await select.open();
    const options = await select.getOptions().then(opts => opts.map(opt => opt.getText()));

    return Promise.all(options);
  }

  async getSelectedCountry(): Promise<string> {
    return this.getCountrySelect().then(select => select.getValueText());
  }

  async selectCountry(filter: OptionHarnessFilters): Promise<void> {
    return this.getCountrySelect().then(select => select.clickOptions(filter));
  }

  async fillForm(data: Partial<User>): Promise<void[]> {
    return Promise.all(
      Object.keys(data).map(async key => {
          const control = await this.getFormField(key).then(field => field.getControl());
          if (control instanceof MatInputHarness) {
            return control.setValue(data[key]);
          } else {
            return this.selectCountry({ text: data[key] });
          }
        }
      ));

  }
}
