import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private firestore: AngularFirestore
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    return;
  }

  // async onSubmit() {
  //   this.spinner.show();
  //   if(this.loginForm.invalid) return;
  //   try {
  //     await this.authService.signIn(this.loginForm.get("email").value, this.loginForm.get("password").value);
  //     this.spinner.hide();
  //     this.authService.setHasUser(true);
  //     this.router.navigate(['/']);
  //   } catch (error) {
  //     this.spinner.hide();
  //     if (error.message === 'INVALID_CREDENTIAL') {
  //       this.snackBar.open("Las credenciales ingresadas son incorrectas.", null, { duration: 3000 });
  //     } else if(error.message === 'INVALID_EMAIL') {
  //       this.snackBar.open("El correo electrónico no está en el formato correcto.", null, { duration: 3000 });
  //     }else{
  //       console.error('Error signing in user:', error);
  //     }
  //   }
  // }
  async onSubmit() {
    this.spinner.show();
    if (this.loginForm.invalid) return;
    try {
      await this.authService.signIn(this.loginForm.get("email").value, this.loginForm.get("password").value);
      this.spinner.hide();
      this.authService.setHasUser(true);

      // Verificar si el usuario tiene hábitos configurados y redirigir
      const userId = await this.authService.getUserId();
      const habitsDoc = await this.firestore.collection('habits').doc(userId).get().toPromise();
      const habitsData = habitsDoc?.data();

      if (habitsData) {
        // Si ya tiene hábitos configurados, redirige al chatbot
        this.router.navigate(['/chatbot']);
      } else {
        // Si no tiene hábitos configurados, redirige al formulario de hábitos
        this.router.navigate(['/habits-form']);
      }
    } catch (error) {
      this.spinner.hide();
      if (error.message === 'INVALID_CREDENTIAL') {
        this.snackBar.open("Las credenciales ingresadas son incorrectas.", null, { duration: 3000 });
      } else if (error.message === 'INVALID_EMAIL') {
        this.snackBar.open("El correo electrónico no está en el formato correcto.", null, { duration: 3000 });
      } else {
        console.error('Error signing in user:', error);
      }
    }
  }

}
