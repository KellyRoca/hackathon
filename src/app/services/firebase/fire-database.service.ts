import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireDatabaseService {

  constructor(private firestore: AngularFirestore) { }

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
