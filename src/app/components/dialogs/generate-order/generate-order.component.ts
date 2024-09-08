import { CartService } from 'src/app/services/cart.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
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


  spinner = true;
  orderUid: string;
  constructor(
    public dialogRef: MatDialogRef<GenerateOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clipBoardService: Clipboard,
    private snackBar: MatSnackBar
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  async onCreateOC(uid: string, total: number, subtotal: number, igv: number): Promise<void> {

  }

  deleteCartDetails() {
  }

  copyData() {
    this.clipBoardService.copy(
      this.orderUid
    );
    this.snackBar.open("El código ha sido copiado en el portapapeles", null, { duration: 3000 });
  }
}
