import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServersService {
  constructor(private http: HttpClient) { }
  public doman: string = "http://127.0.0.1:3001";
  get(api) {
    // console.log(this.doman)

    let getdoman = window.localStorage.getItem('domain')
    if (getdoman) {
      this.doman = getdoman
    }

    return new Promise((resolve, reject) => {

      this.http.get(this.doman + api).subscribe((reponse) => {
        
        resolve(reponse)

      })
     

    })
  }
  post(api,bodys){
    return new Promise((resolve, reject) => {

      this.http.post(this.doman + api,bodys).subscribe((reponse) => {
        
        resolve(reponse)

      })
     

    })
  }
}
