import {Injectable} from "@angular/core";
import {Http, RequestOptions, Headers} from "@angular/http";
import { Storage } from '@ionic/storage';
import {Observable} from "rxjs";


const storage: Storage = new Storage();

@Injectable()
export class OrderService {

  constructor(private http: Http) {}

  private get makeRequestOptions(): Promise<RequestOptions> {
    return storage.get('token').then((token: string) => {
      const headers: Headers =  new Headers({Authorization: `Token ${token}`});
      return new RequestOptions({headers: headers});
    });

  }

  getTodayOrders(): Observable<IOrder[]> {
    return Observable.fromPromise(this.makeRequestOptions.then((request: RequestOptions) => {
      return this.http.get('http://127.0.0.1:8000/today/', request).map(res => res.json());
    }))
      .flatMap(e => e)
      .switchMap((orders: IOrder[]) => orders)
      .map((order: IOrder) => {return {...order, isVisible: false }})
      .toArray();
  }

  changeOrderColor(orderID: number, colorID: number): Observable<any> {
    return Observable.fromPromise(this.makeRequestOptions.then((request: RequestOptions) => {
      return this.http.post(`http://127.0.0.1:8000/my-orders/`, {
        order: orderID,
        color: colorID
      }, request).map(res => res.json());
    }))
      .flatMap(e => e);
  }

  filterMyOrders(): Observable<any> {
    return Observable.fromPromise(this.makeRequestOptions.then((request: RequestOptions) => {
      return this.http.get(`http://127.0.0.1:8000/my-orders`, request)
        .map(res => res.json())
        .map((res: IOrder[]) => {
          const finalArray: {date: any, orders: IOrder[], isVisible: boolean}[] = [];
          res.forEach((order: IOrder) => {
            const matchingDates: any[] = finalArray.filter((day) => day.date == order.date).map(day => day.date);
            if (matchingDates.length) {
              const index: number = matchingDates.indexOf(order.date);
              finalArray[index].orders.push(order);
            } else {
              finalArray.push({date: order.date, orders: [order], isVisible: false});
            }
          });
          return finalArray;
        });
    }))
      .flatMap(e => e);
  }

}
