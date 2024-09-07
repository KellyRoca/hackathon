import { StorageService } from './../../services/storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CartItem } from 'src/app/interface/model';
import { CartService } from 'src/app/services/cart.service';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { PreviewOrderComponent } from '../dialogs/preview-order/preview-order.component';
import { GenerateOrderComponent } from '../dialogs/generate-order/generate-order.component';
import { Subject, takeUntil } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  selectedItems: boolean[] = [];
  destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.storageService.get('cart').subscribe((res: CartItem[]) => {
      this.cartItems = res == null ? []: res;
      this.cd.detectChanges();
      this.selectedItems = new Array(this.cartItems?.length).fill(false);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
    this.updateCartService();
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.updateCartService();
  }

  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item);
    this.updateCartService();
  }

  toggleSelection(index: number, event: Event): void {
    this.selectedItems[index] = (event.target as HTMLInputElement).checked;
  }

  removeSelected(): void {
    this.cartItems = this.cartItems.filter((item, index) => !this.selectedItems[index]);
    this.selectedItems = this.selectedItems.filter(selected => !selected);
    this.updateCartService();
  }

  updateCartService() {
    this.cartService.setCart(this.cartItems);
    this.storageService.set('cart', this.cartItems);
  }

  get subtotal(): number {
    return parseFloat((this.total / 1.18).toFixed(2));
  }

  get total(): any {
    if (this.cartItems == null) return;
    let totalt = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return parseFloat(totalt.toFixed(2))
  }

  get igv(): number {
    return parseFloat((this.total - this.subtotal).toFixed(2));
  }

  clearCart(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cartItems = [];
        this.updateCartService();
        this.router.navigate(['/']);
      }
    });
  }

  orderPreview() {
    this.dialog.open(PreviewOrderComponent, {
      width: '95%',
      maxWidth: '800px',
      autoFocus: false,
      height: '70%',
      data: {}
    });
  }

  generateOC() {
    this.dialog.open(GenerateOrderComponent, {
      width: '90%',
      maxWidth: '570px',
      autoFocus: false,
      data: {
        total: this.total,
        subtotal: this.subtotal,
        igv: this.igv
      },
      minHeight: '250px',
      disableClose: true,
    }).afterClosed().subscribe(() => {
      this.router.navigate(['/order-history']);
    });
  }

  goTo(url: string) {
    this.router.navigate([url]);
  }

  get isAnyItemSelected(): boolean {
    return this.selectedItems.some(selected => selected);
  }
  
}
