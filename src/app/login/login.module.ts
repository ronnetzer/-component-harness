import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { LoginComponent } from "./login.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
  ],
  providers: [],
  exports: [LoginComponent]
})
export class LoginModule {
}
