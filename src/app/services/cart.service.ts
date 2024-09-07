import { Injectable } from '@angular/core';
import { CartItem, Product } from '../interface/model';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private productCatalogSubject = new BehaviorSubject<Product[] | any>(null);
  productCatalogSubject$ = this.productCatalogSubject.asObservable();


  private cartSubject = new BehaviorSubject<any>(null);
  cartSubject$ = this.cartSubject.asObservable();

  constructor(
    private storageService: StorageService
  ){
    forkJoin([
      this.storageService.get('products'),
      this.storageService.get('cart')
    ]).subscribe((res:[Product[], CartItem[]]) => {
      if(res[0]!= null){
        this.setProductCatalog(res[0]);
      }
      if(res[1]!= null){
        this.setCart(res[1]);
      }
   })
  }

  setProductCatalog(products: Product[]) {
    this.productCatalogSubject.next(products);
  }

  getProductCatalog() {
    return this.productCatalogSubject.getValue();
  }

  setCart(items: CartItem[]) {
    this.cartSubject.next(items);
  }

  getCart() {
    return this.cartSubject.getValue();
  }

  deleteCart(){
    this.cartSubject.next(null);
  }
}
