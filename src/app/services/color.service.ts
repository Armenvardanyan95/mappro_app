import {Injectable} from "@angular/core";
import {Http, RequestOptions, Headers} from "@angular/http";
import { Storage } from '@ionic/storage';
import {Observable} from "rxjs";

const storage: Storage = new Storage();

@Injectable()
export class ColorService {

  constructor(private http: Http) {}

  private get makeRequestOptions(): Promise<RequestOptions> {
    return storage.get('token').then((token: string) => {
      const headers: Headers =  new Headers({Authorization: `Token ${token}`});
      return new RequestOptions({headers: headers});
    });

  }


  getAll(): Observable<any> {
    return Observable.fromPromise(this.makeRequestOptions.then((request: RequestOptions) => {
      return this.http.get('http://mappro.vioo.xyz:8000/colors/', request).map(res => res.json());
    }))
      .flatMap(e => e);
  }
}
