import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_Services/User.service';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_Services/Auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
constructor(private userservice: UserService, private alertify: AlertifyService, private route: Router, private authService: AuthService) {}

resolve(route: ActivatedRouteSnapshot): Observable<User> {
  return this.userservice.getUser(this.authService.decodedToken.nameid).pipe(
      catchError(error => {
      this.alertify.Error('Problem retriving your profile data.');
      this.route.navigate(['/members']);
      return of(null);
      }) );
 }
}
