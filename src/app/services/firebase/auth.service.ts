import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, from, lastValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private isAuthenticated = new BehaviorSubject<boolean>(null);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  private _storage: Storage | null = null;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private storage: Storage,
    private router: Router
  ) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  setHasUser(value: boolean) {
    this.isAuthenticated.next(value);
  }

  getHasUser() {
    return this.isAuthenticated.getValue();
  }

  async signUp(email: string, password: string, firstName: string, lastName: string, middleName: string, docType: string, docNumber: string, phone: string, ruc: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user) {
        await this.firestore.collection('users').doc(user.uid).set({
          firstName: firstName,
          lastName: lastName,
          middleName: middleName,
          docType: docType,
          docNumber: docNumber,
          phone: phone,
          email: email,
          ruc: ruc
        });
        await this._storage?.set('user', { email, password, firstName, lastName, middleName, docType, docNumber, phone, user: user.uid, ruc });
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('EMAIL_ALREADY_IN_USE');
      } else {
        throw error;
      }
    }
  }

  async signIn(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user) {
        const userDocRef = this.firestore.collection('users').doc(user.uid);
        const userDoc = await lastValueFrom(userDocRef.get());
        const userData: any = userDoc.data();
        if (userData) {
          await this._storage?.set('user', { email, password, ...userData, user: user.uid });
        } else {
          console.error('User data not found in Firestore');
        }
      }
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        throw new Error('INVALID_CREDENTIAL');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('INVALID_EMAIL');
      } else {
        throw error;
      }
    }
  }

  async signOut() {
    await this.afAuth.signOut();
    await this._storage?.clear();
    this.router.navigate(['']);
    location.reload();
  }
}
