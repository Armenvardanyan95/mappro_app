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

  private groupBy<T extends IOrder>(list: Array<T>, keyGetter): Array<any> {
    const map: Map<string, T[]> = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    const retarr = [];

    map.forEach((value, key) => {
      retarr.push({date: key, orders: value.sort((order1: IOrder, order2: IOrder) => this.compareTimes(order1.timeTo, order2.timeTo))})
    });

    const final = retarr.sort((a: IOrder, b: IOrder) => (new Date(b.date)).valueOf() - (new Date(a.date)).valueOf());

    return final;
  }

  private compareTimes(t1: string, t2: string): 1 | -1 | 0 {
    if (!t1 || !t2) return 0;
    const {0: hours1, 1: minutes1} = t1.split(':').map(n => +n);
    const {0: hours2, 1: minutes2} = t2.split(':').map(n => +n);

    if (hours1 > hours2) return 1;
    if (hours1 < hours2) return -1;
    if (hours1 === hours2 && minutes1 > minutes2) return 1;
    if (hours1 === hours2 && minutes1 < minutes2) return -1;
    return 0;
  }

  getTodayOrders(): Observable<IOrder[]> {
    return Observable.fromPromise(this.makeRequestOptions.then((request: RequestOptions) => {
      return this.http.get('https://mappro.herokuapp.com/today/', request).map(res => res.json());
    }))
      .flatMap(e => e)
      .switchMap((orders: IOrder[]) => orders)
      .map((order: IOrder) => ({...order, isVisible: false }))
      .toArray()
      .map(orders => orders.sort((order1, order2) => this.compareTimes(order1.timeTo, order2.timeTo)))
  }

  changeOrderColor(orderID: number, colorID: number): Observable<any> {
    return Observable.fromPromise(this.makeRequestOptions.then((request: RequestOptions) => {
      return this.http.post(`https://mappro.herokuapp.com/my-orders/`, {
        order: orderID,
        color: colorID
      }, request).map(res => res.json());
    }))
      .flatMap(e => e);
  }

  filterMyOrders({dateFrom, dateTo}): Observable<any> {
    return Observable.fromPromise(this.makeRequestOptions.then((request: RequestOptions) => {
      return this.http.post(`https://mappro.herokuapp.com/mobile/order-by-date/`, {dateFrom, dateTo}, request)
        .map(res => res.json())
        .map((res: IOrder[]) => this.groupBy(res, order => order.date));
    }))
      .flatMap(e => e);
  }

}
