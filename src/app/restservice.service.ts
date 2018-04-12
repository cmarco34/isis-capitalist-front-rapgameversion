import { Injectable } from '@angular/core';

import { Http, Response, Headers } from '@angular/http'
import { World, Pallier, Product } from './world';

@Injectable()
export class RestserviceService {
  server = "http://localhost:8080/isisRapGame/"
  user = "";

  constructor(private http: Http) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  
  private setHeaders(user : string) : Headers {
    var headers = new Headers();
    headers.append("X-User",user);
    return headers;
  }

  getWorld(): Promise<World> {
    return this.http.get(this.server + "webresources/generic/world", {
      headers: this.setHeaders(this.user)})
        .toPromise().then(response =>
      response.json()).catch(this.handleError);
    }
    

  setUser(nom : string) {
    this.user = nom;
  }

  getUser() {
    return this.user;
  }

  getServer() {
    return this.server;
  }
}