import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderConfirmedComponent } from './components/order-confirmed/order-confirmed.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { SharedModule } from './components/shared/shared.module';
import { RegisterComponent } from './components/auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './components/auth/login/login.component';
import { firebaseConfig } from './environments/firebase-config';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { MaterialModule } from './components/shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { PreviewOrderComponent } from './components/dialogs/preview-order/preview-order.component';
import { GenerateOrderComponent } from './components/dialogs/generate-order/generate-order.component';
import { NeedLoginComponent } from './components/dialogs/need-login/need-login.component';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    CartComponent,
    OrderConfirmedComponent,
    OrderHistoryComponent,
    RegisterComponent,
    LoginComponent,
    ConfirmDialogComponent,
    PreviewOrderComponent,
    GenerateOrderComponent,
    NeedLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot(),
    NgxSpinnerModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
