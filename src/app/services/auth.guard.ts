import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private _storage: Storage | null = null;

  constructor(private router: Router, private storage: Storage, private firestore: AngularFirestore) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async canActivate(): Promise<boolean> {
    // Esperar la inicialización del almacenamiento si no está listo
    if (!this._storage) {
      await this.init();
    }

    const user = await this._storage?.get('user');  // Obtener el usuario del almacenamiento local

    if (user) {
      const userId = user.user;  // Obtener el userId del almacenamiento local

      return firstValueFrom(this.checkHabits(userId));  // Usar firstValueFrom para convertir el observable a promesa
    } else {
      // Si no está autenticado, redirige al login
      this.router.navigate(['/login']);
      return false;
    }
  }

  checkHabits(userId: string): Observable<boolean> {
    return this.firestore.collection('habits').doc(userId).valueChanges().pipe(
      take(1),  // Solo necesitamos tomar el primer valor que emita el observable
      map(habitsData => {
        if (habitsData) {
          console.log('1')
          // Si el usuario tiene hábitos configurados, redirige al chatbot
          this.router.navigate(['/chatbot']);
          return false;  // Evitar continuar en la ruta actual
        } else {
          console.log('2')
          // Si no tiene hábitos configurados, redirige al formulario de hábitos
          this.router.navigate(['/habits-form']);
          return false;  // Evitar continuar en la ruta actual
        }
      })
    );
  }
}
