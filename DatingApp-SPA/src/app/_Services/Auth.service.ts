import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseurl = environment.ApiUrl + 'UserAuth/';
  JwtHelper = new JwtHelperService();
  decodedToken: any;
  Currentuser: User;
  PhotoUrl = new BehaviorSubject<string>('../../assets/user.png');
  CurrentPhotoUrl = this.PhotoUrl.asObservable();
constructor(private http: HttpClient) { }

ChangeCurrentPhoto(photoUrl: string) {
    this.PhotoUrl.next(photoUrl);
}
login(model: any) {
return this.http.post(this.baseurl + 'login', model)
.pipe(map((response: any) => {
  const userToken = response;
  if (userToken) {
    localStorage.setItem('Token', userToken.token);
    localStorage.setItem('User', JSON.stringify(userToken.user));
    this.decodedToken = this.JwtHelper.decodeToken(userToken.token);
    this.Currentuser = userToken.user;
    this.ChangeCurrentPhoto(this.Currentuser.photoUrl);
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
