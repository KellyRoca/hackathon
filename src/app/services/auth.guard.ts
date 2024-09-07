import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private _storage: Storage | null = null;

  constructor(private router: Router, private storage: Storage) {
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

    const user = await this._storage?.get('user');

    if (user) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
