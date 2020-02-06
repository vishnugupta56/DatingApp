import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/User';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_Services/User.service';
import { AuthService } from 'src/app/_Services/Auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './Member-edit.component.html',
  styleUrls: ['./Member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  user: User;
  photoUrl: string;
  // access child object usign ViewChild option
  @ViewChild('EditForm', { static: true }) EditForm: NgForm;
  // prevent user to close window if data is not saved
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.EditForm.dirty) {
      $event.returnValue = true;
    }
  }


  constructor(private activeRoute: ActivatedRoute , private alertify: AlertifyService
     ,        private userservice: UserService , private authService: AuthService ) { }

  ngOnInit() {
    this.authService.CurrentPhotoUrl.subscribe(photo => this.photoUrl = photo);
    this.activeRoute.data.subscribe(data => {
     this.user = data['user'];
    });

  }

  UpdateUser() {
  this.userservice.UpdateUer(this.authService.decodedToken.nameid, this.user).subscribe(next => {
    this.alertify.Success('Profile Updated successfully');
    this.EditForm.reset(this.user);
  }, error => {
    this.alertify.Error(error);
  });
  }

  UpdateUserMainPhoto(photoUrl: string) {
    this.user.photoUrl = photoUrl;
  }
}
