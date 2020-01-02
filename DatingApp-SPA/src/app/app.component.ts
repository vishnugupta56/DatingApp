import { Component, OnInit } from '@angular/core';
import { AuthService } from './_Services/Auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'App';
  JwtTokenHelper = new JwtHelperService();
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.GetDecodedTokenValue();
  }
 GetDecodedTokenValue() {
   const Token = localStorage.getItem('Token');
   this.auth.decodedToken = this.JwtTokenHelper.decodeToken(Token);
 }
}
