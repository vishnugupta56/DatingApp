import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {  };
  constructor(public authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
  }

  login()  {
    this.authService.login(this.model).subscribe(next => {
        this.alertify.Success('user logged in successfully');
      }, error => {
        this.alertify.Error(error);
      }, () => {
         this.router.navigate(['/memberslists']);
      }
      );
  }
  loggedIn() {
      return this.authService.loggedIn();
  }
  loggedOut()  {
    localStorage.removeItem('Token');
    localStorage.removeItem('Username');
    this.router.navigate(['\home']);
    this.alertify.Message('user logged out successfully');
  }
}
