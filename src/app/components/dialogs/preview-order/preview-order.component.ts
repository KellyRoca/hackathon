import { StorageService } from 'src/app/services/storage.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartItem } from 'src/app/interface/model';

@Component({
  selector: 'app-preview-order',
  templateUrl: './preview-order.component.html',
  styleUrl: './preview-order.component.scss'
})
export class PreviewOrderComponent implements OnInit {

  cartItems: CartItem[] = [];
  currentDate: Date = new Date();
  userData: any;

  constructor(
    public dialogRef: MatDialogRef<PreviewOrderComponent>,
    private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.storageService.get('cart').subscribe((res: CartItem[]) => {
      this.cartItems = res;
    });

    this.storageService.get('user').subscribe((res) => {
      this.userData = res;
    })
  }

  get subtotal(): number {
    return parseFloat((this.total / 1.18).toFixed(2));
  }

  get total(): number {
    let totalt =this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return parseFloat(totalt.toFixed(2))
  }

  get igv(): number {
    return parseFloat((this.total - this.subtotal).toFixed(2));
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
