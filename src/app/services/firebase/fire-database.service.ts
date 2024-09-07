import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { CartItem, Product } from 'src/app/interface/model';

@Injectable({
  providedIn: 'root'
})
export class FireDatabaseService {

  constructor(private firestore: AngularFirestore) { }

  getProducts(): Observable<Product[]> {
    return this.firestore.collection<Product>('products').valueChanges({ idField: 'id' });
  }

  async createOC(user: string, orderDetails: CartItem[], total: number, subtotal: number, igv: number) {
    try {
      const docRef = await this.firestore.collection('orders').add({
        user: user,
        orderDetails: orderDetails,
        subtotal: subtotal,
        igv: igv,
        total: total,
        date: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.log('error', error)
      return ''
    }
  }

  getOrdersByUser(userId: string): Observable<any[]> {
    return this.firestore.collection('orders', ref => ref.where('user', '==', userId))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }
}
