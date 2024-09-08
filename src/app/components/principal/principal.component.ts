import { NeedLoginComponent } from 'src/app/components/dialogs/need-login/need-login.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  hasUser: boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
  ) { }


  ngOnInit(): void {

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
