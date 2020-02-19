import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_Services/Auth.service';
import { UserService } from 'src/app/_Services/User.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './Member-Card.component.html',
  styleUrls: ['./Member-Card.component.css']
})
export class MemberCardComponent implements OnInit {
@Input() user: User;
  constructor(private auth: AuthService, private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  sendLike(id: number) {
    this.userService.SendLike(this.auth.decodedToken.nameid, id).subscribe( res => {
      this.alertify.Success('You have liked: ' + this.user.knownAs);
    }, error => {
      this.alertify.Error(error);
    });
  }

}
