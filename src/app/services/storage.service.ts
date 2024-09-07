import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { forkJoin, from, Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor(private storage: Storage) {}

  public set<T>(key: string, value: any): Observable<T> {
    return from(<Promise<T>>this.storage.set(key, value));
  }

  public get<T>(key: string): Observable<T> {
    return from(<Promise<T | null>>this.storage.get(key));
  }

  public remove(key: string): Observable<undefined> {
    return from(<Promise<undefined>>this.storage.remove(key));
  }

  clearStorage(): Observable<any> {
    return forkJoin([
      this.remove("user"),
      this.remove("cart"),
      this.remove("products"),
    ]);
  }
}
