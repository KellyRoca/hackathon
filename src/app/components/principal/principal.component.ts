import { CartItem, Product } from 'src/app/interface/model';
import { NeedLoginComponent } from 'src/app/components/dialogs/need-login/need-login.component';
import { Component, OnInit } from '@angular/core';
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
      this.spinner.hide();
    })

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

  goTo(url: string) {
    this.router.navigate([url]);
  }

}
