import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  private cartSubject = new BehaviorSubject<any>(null);
  cartSubject$ = this.cartSubject.asObservable();

  constructor(
    private storageService: StorageService
  ){
  }


  getCart() {
    return this.cartSubject.getValue();
  }

  deleteCart(){
    this.cartSubject.next(null);
  }
}
