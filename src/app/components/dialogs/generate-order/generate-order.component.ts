import { CartService } from 'src/app/services/cart.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { CartItem } from 'src/app/interface/model';
import { FireDatabaseService } from 'src/app/services/firebase/fire-database.service';
import { StorageService } from 'src/app/services/storage.service';
import { Clipboard } from "@angular/cdk/clipboard";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-generate-order',
  templateUrl: './generate-order.component.html',
  styleUrl: './generate-order.component.scss'
})
export class GenerateOrderComponent implements OnInit {

  cartDetails: CartItem[] = [];
  spinner = true;
  orderUid: string;
  constructor(
    public dialogRef: MatDialogRef<GenerateOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storageService: StorageService,
    private firebaseService: FireDatabaseService,
    private cartService: CartService,
    private clipBoardService: Clipboard,
    private snackBar: MatSnackBar
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    forkJoin([
      this.storageService.get('cart'),
      this.storageService.get('user')
    ]).subscribe((res: [CartItem[], any]) => {
      this.cartDetails = res[0];
      let uid = res[1].user;
      this.spinner = true;
      this.onCreateOC(uid, this.data?.total, this.data?.subtotal, this.data?.igv);

    })
  }

  async onCreateOC(uid: string, total: number, subtotal: number, igv: number): Promise<void> {
    try {
      const orderId = await this.firebaseService.createOC(uid, this.cartDetails, total, subtotal, igv);
      this.orderUid = orderId;
      this.deleteCartDetails();
      this.spinner = false;
    } catch (error) {
      console.error('Error al crear la orden:', error);
    }
  }

  deleteCartDetails() {
    this.cartDetails = [];
    this.cartService.deleteCart();
    this.storageService.remove('cart');
  }

  copyData() {
    this.clipBoardService.copy(
      this.orderUid
    );
    this.snackBar.open("El código ha sido copiado en el portapapeles", null, { duration: 3000 });
  }
}
