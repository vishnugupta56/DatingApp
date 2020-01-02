import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {  };
  constructor(public authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  login()  {
    this.authService.login(this.model).subscribe(next => {
        this.alertify.Success('user logged in successfully');
      }, error => {
        this.alertify.Error(error);
      }
      );
  }
  loggedIn() {
      return this.authService.loggedIn();
  }
  loggedOut()  {
    localStorage.removeItem('Token');
    localStorage.removeItem('Username');
    this.alertify.Message('user logged out successfully');
  }
}
