import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Messages } from '../_models/Messages';
import { UserService } from '../_Services/User.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { AuthService } from '../_Services/Auth.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MessagesResolver implements Resolve<Messages[]> {
 pageNumber = 1;
 pageSize = 5;
 messageContainer = 'Unread';
constructor(private userService: UserService, private alertify: AlertifyService, private route: Router, private authService: AuthService) {}

resolve(route: ActivatedRouteSnapshot): Observable<Messages[]> {
 return this.userService.GetMessages(this.authService.decodedToken.nameid, this.pageNumber, this.pageSize, this.messageContainer).pipe(
     catchError(error => {
        this.alertify.Error('Problem retriving Messages');
        this.route.navigate(['/home']);
        return of(null);
     })
 );
}
}