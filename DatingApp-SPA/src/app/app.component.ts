import { Component, OnInit } from '@angular/core';
import { AuthService } from './_Services/Auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'App';
  JwtTokenHelper = new JwtHelperService();
  photoUrl: string;
  constructor(private auth: AuthService) {}
  ngOnInit() {
    this.GetDecodedTokenValue();
  }
 GetDecodedTokenValue() {
   const Token = localStorage.getItem('Token');
   const user: User = JSON.parse(localStorage.getItem('User'));
   if (Token) {
   this.auth.decodedToken = this.JwtTokenHelper.decodeToken(Token);
   }
   if (user) {
   this.auth.Currentuser = user;
   this.auth.ChangeCurrentPhoto(user.photoUrl);
   }
 }
}
