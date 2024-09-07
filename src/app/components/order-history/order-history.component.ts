import { StorageService } from 'src/app/services/storage.service';
import { Component, OnInit } from '@angular/core';
import { FireDatabaseService } from 'src/app/services/firebase/fire-database.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent implements OnInit {

  orders: any[] = [];

  constructor(
    private firebaseService: FireDatabaseService,
    private storageService: StorageService
  ){}

  ngOnInit(): void {
    this.storageService.get('user').subscribe((res: any) => {
      this.firebaseService.getOrdersByUser(res?.user).subscribe((res) => {
        this.orders = res;
      })
    })
  }

}
