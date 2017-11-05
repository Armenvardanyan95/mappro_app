import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  private baseAuthUrl: string = 'http://mappro.vioo.xyz:8000/api-token-auth/';
  public authChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: Http) {
  }

  authenticate(credentials: IUserAuth): Observable<{token: string}> {
    return this.http.post(this.baseAuthUrl, credentials)
      .map((res: Response) => res.json());
  }

}
