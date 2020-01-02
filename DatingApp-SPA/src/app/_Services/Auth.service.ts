import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseurl = 'http://localhost:5000/api/UserAuth/';
  JwtHelper = new JwtHelperService();
  decodedToken: any;
constructor(private http: HttpClient) { }

login(model: any) {
return this.http.post(this.baseurl + 'login', model)
.pipe(map((response: any) => {
  const userToken = response;
  if (userToken) {
    localStorage.setItem('Token', userToken.token);
    this.decodedToken = this.JwtHelper.decodeToken(userToken.token);
    }
  })
 );
}

register(model: any) {
return this.http.post(this.baseurl + 'register', model);
}

loggedIn() {
 const Token = localStorage.getItem('Token');
 return !this.JwtHelper.isTokenExpired(Token);
}

}
