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
  maxDate = new Date(2009, 11, 31);

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {
    this.stepOneForm = this.fb.group({
      docNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      promo: [false],
      terms: [false, [Validators.requiredTrue]]
    });

    this.stepTwoForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      birthdate: ['', Validators.required],
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
      const { email, password, docNumber } = this.stepOneForm.value;
      const { firstName, lastName, middleName, phone } = this.stepTwoForm.value;

      const birthdate = this.formatDate(this.stepTwoForm.get('birthdate').value);

      try {
        await this.authService.signUp(email, password, firstName, lastName, middleName, phone, docNumber, birthdate);
        this.spinner.hide();
        this.authService.setHasUser(true);
        this.router.navigate(['habits-form']);
      } catch (error) {
        this.spinner.hide();
        if (error.message === 'EMAIL_ALREADY_IN_USE') {
          this.snackBar.open("El correo electrónico ya está en uso. Por favor, utiliza otro correo electrónico.", null, { duration: 3000 });
          this.stepOne = true;
        } else {
          console.error('Error creando usuario:', error);
        }
      }
    }
  }


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

}
