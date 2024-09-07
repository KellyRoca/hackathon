import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-need-login',
  templateUrl: './need-login.component.html',
  styleUrl: './need-login.component.scss'
})
export class NeedLoginComponent {
  constructor(
    public dialogRef: MatDialogRef<NeedLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  close(): void {
    this.dialogRef.close();
  }
}
