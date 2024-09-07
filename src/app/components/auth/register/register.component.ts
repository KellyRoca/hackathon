import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  stepOne: boolean = true;
  stepOneForm: FormGroup;
  stepTwoForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {
    this.stepOneForm = this.fb.group({
      ruc: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      promo: [false],
      terms: [false, [Validators.requiredTrue]]
    });

    this.stepTwoForm = this.fb.group({
      docType: ['', [Validators.required]],
      docNumber: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]]
    });
  }

  nextStep() {
    if (this.stepOneForm.valid) {
      this.stepOne = false;
    }
  }

  async onSignUp() {
    this.spinner.show();
    if (this.stepTwoForm.valid) {
      const { email, password, ruc } = this.stepOneForm.value;
      const { firstName, lastName, middleName, docType, docNumber, phone } = this.stepTwoForm.value;

      try {
        await this.authService.signUp(email, password, firstName, lastName, middleName, docType, docNumber, phone, ruc);
        // console.log('User created successfully');
        this.spinner.hide();
        this.authService.setHasUser(true);
        this.router.navigate(['/']); // Redirigir a la página de inicio después del registro
      } catch (error) {
        this.spinner.hide();
        if (error.message === 'EMAIL_ALREADY_IN_USE') {
          this.snackBar.open("El correo electrónico ya está en uso. Por favor, utiliza otro correo electrónico.", null, { duration: 3000 });
          this.stepOne = true; // Volver al primer paso para que el usuario pueda corregir el email
        } else {
          console.error('Error creating user:', error);
        }
      }
    }
  }

}