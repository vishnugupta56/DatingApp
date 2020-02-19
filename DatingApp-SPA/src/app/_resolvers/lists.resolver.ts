import { User } from '../_models/User';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../_Services/User.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ListsResolver implements Resolve<User[]> {
  pageNumber = 1;
  pageSize = 5;
  Likeparams = 'likers';
    constructor(private userService: UserService, private alertify: AlertifyService, private route: Router) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
      return this.userService.getUsers(this.pageNumber, this.pageSize, null , this.Likeparams).pipe(
          catchError(error => {
                this.alertify.Error('Problem receiving Users data.');
                this.route.navigate(['/home']);
                return of(null);
          })
      );
    }
}
