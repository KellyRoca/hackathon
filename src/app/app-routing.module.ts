import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from 'src/app/components/principal/principal.component';
import { RegisterComponent } from 'src/app/components/auth/register/register.component';
import { LoginComponent } from 'src/app/components/auth/login/login.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { HabitsFormComponent } from './components/habits-form/habits-form.component';
import { LandingComponent } from './components/landing/landing.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'inicio', component: PrincipalComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'chatbot', component: ChatbotComponent },  // Protegido por el AuthGuard
  { path: 'habits-form', component: HabitsFormComponent },  // Protegido por el AuthGuard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
