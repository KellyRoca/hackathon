import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from 'src/app/components/principal/principal.component';
import { CartComponent } from 'src/app/components/cart/cart.component';
import { OrderConfirmedComponent } from 'src/app/components/order-confirmed/order-confirmed.component';
import { OrderHistoryComponent } from 'src/app/components/order-history/order-history.component';
import { RegisterComponent } from 'src/app/components/auth/register/register.component';
import { LoginComponent } from 'src/app/components/auth/login/login.component';
import { AuthGuard } from 'src/app/services/auth.guard';

const routes: Routes = [
  { path: '', component: PrincipalComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'order-confirmed', component: OrderConfirmedComponent, canActivate: [AuthGuard] },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard] },

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
