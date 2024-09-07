import { CartItem, Product } from 'src/app/interface/model';
import { NeedLoginComponent } from 'src/app/components/dialogs/need-login/need-login.component';
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { FireDatabaseService } from 'src/app/services/firebase/fire-database.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  hasUser: boolean = false;
  products: Product[] = [];
  cart: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private fireDatabase: FireDatabaseService,
    private router: Router,
    private storageService: StorageService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) { }


  ngOnInit(): void {
    this.spinner.show();

    forkJoin([
      this.storageService.get('user'),
      this.storageService.get('cart')
    ]).subscribe(([user, cart]: [any, CartItem[] | null]) => {
      this.hasUser = user == null ? false : true;
      if (cart != null) {
        this.cart = cart;
      }
    })

    this.fireDatabase.getProducts().subscribe((res) => {
      this.products = res.sort((a, b) => a.name.localeCompare(b.name));
      this.cartService.setProductCatalog(res);
      this.storageService.set('products', res);
      this.spinner.hide();
    });
  }

  addToCart(product: Product) {
    if (!this.hasUser) return this.openDialogRedirect();
    let cartItem = this.cart.find(item => item.id === product.id);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      this.cart.push({ id: product.id, quantity: 1, price: product.price, name: product.name, image: product.img });
    }
    this.updateCartService();
  }

  openDialogRedirect() {
    this.dialog.open(NeedLoginComponent, {
      width: '90%',
      maxWidth: '570px',
      autoFocus: false,
      data: {
      },
      minHeight: '250px',
      disableClose: true,
    }).afterClosed().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  incrementQuantity(product: Product) {
    let cartItem = this.cart.find(item => item.id === product.id);
    if (cartItem) {
      cartItem.quantity++;
    }
    this.updateCartService();
  }

  decrementQuantity(product: Product) {
    let cartItem = this.cart.find(item => item.id === product.id);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
      } else {
        this.cart = this.cart.filter(item => item.id !== product.id);
      }
    }
    this.updateCartService();
  }

  isInCart(productId: string): boolean {
    return this.cart.some(item => item.id === productId);
  }


  getCartItem(productId: string): CartItem | undefined {
    return this.cart.find(item => item.id === productId);
  }

  updateQuantity(product: Product, event: any) {
    let quantity = parseInt(event?.target?.value, 10);
    if (!isNaN(quantity) && quantity >= 1) {
      let cartItem = this.cart.find(item => item.id === product.id);
      if (cartItem) {
        cartItem.quantity = quantity;
      }
    }
    this.updateCartService();
  }


  goToCart() {
    this.cartService.setCart(this.cart);
    this.router.navigate(['/cart'],)
  }

  updateCartService() {
    this.cartService.setCart(this.cart);
    this.storageService.set('cart', this.cart);
  }
}
