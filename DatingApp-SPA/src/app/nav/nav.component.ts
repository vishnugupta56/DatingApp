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
  photoUrl: string;
  constructor(public authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
  this.authService.CurrentPhotoUrl.subscribe(photourl => this.photoUrl = photourl);
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
    localStorage.removeItem('User');
    this.authService.Currentuser = null;
    this.authService.decodedToken = null;
    this.alertify.Message('user logged out successfully');
    this.router.navigate(['\home']);

  }
}
