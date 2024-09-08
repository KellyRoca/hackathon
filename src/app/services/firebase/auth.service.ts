import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, firstValueFrom, from, lastValueFrom } from 'rxjs';
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

    // Cargar el estado de autenticación desde el Storage al inicializar
    const hasUser = await this._storage.get('isAuthenticated');
    this.isAuthenticated.next(hasUser === true);
  }

  // Modificar para guardar el estado de autenticación en Storage
  async setHasUser(value: boolean) {
    this.isAuthenticated.next(value);
    if (this._storage) {
      await this._storage.set('isAuthenticated', value); // Guardar el estado en el almacenamiento
    }
  }

  getHasUser() {
    return this.isAuthenticated.getValue();
  }

  async signUp(email: string, password: string, firstName: string, lastName: string, middleName: string, phone: string, docNumber: string, birthdate: any) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user) {
        await this.firestore.collection('users').doc(user.uid).set({
          firstName: firstName,
          lastName: lastName,
          middleName: middleName,
          docType: 'DNI',
          docNumber: docNumber,
          phone: phone,
          email: email,
          birthdate: birthdate,
        });
        await this._storage?.set('user', { email, password, firstName, lastName, middleName, phone, user: user.uid, docNumber, birthdate });
        // Set the user as authenticated
        await this.setHasUser(true);
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
          // Set the user as authenticated
          await this.setHasUser(true);
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

  // Eliminar el estado de autenticación y limpiar el almacenamiento en signOut
  async signOut() {
    await this.afAuth.signOut();
    await this._storage?.clear();  // Limpiar el almacenamiento
    await this.setHasUser(false);  // Cambiar el estado de autenticación a false
    this.router.navigate(['/']);
  }

  // Método para obtener el UID del usuario autenticado
  // async getUserId(): Promise<string | null> {
  //   const user = await this.afAuth.currentUser;
  //   return user ? user.uid : null;
  // }
  async getUserId(): Promise<string | null> {
    try {
      // Intentar obtener el usuario actual desde Firebase Authentication
      const user = await this.afAuth.currentUser;

      // Si el usuario no se encuentra, intentar obtenerlo desde authState
      if (!user) {
        const authState = await firstValueFrom(this.afAuth.authState);
        if (authState) {
          return authState.uid;
        }
      }

      // Si el usuario no se obtiene de Firebase, intentar obtenerlo del Storage
      if (!user) {
        const storedUser = await this._storage?.get('user');
        return storedUser ? storedUser.user : null;  // Verificar que el 'user' esté en el Storage y devolver el UID
      }

      return user.uid;
    } catch (error) {
      console.error('Error al obtener el UID del usuario:', error);
      return null;
    }
  }


  // Método para obtener el nombre del usuario autenticado (si está disponible)
  async getUserName(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const userDocRef = this.firestore.collection('users').doc(user.uid);
      const userDoc = await lastValueFrom(userDocRef.get());
      const userData: any = userDoc.data();
      return userData ? userData.firstName : null;
    }
    return null;
  }

  clearUserFromStorage() {
    if (this._storage) {
      this._storage.remove('user').then(() => {
        console.log('Usuario eliminado del storage');
      }).catch(error => {
        console.error('Error al eliminar el usuario del storage:', error);
      });
    }
  }

}
