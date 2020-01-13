import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { AlertifyService } from '../../_Services/alertify.service';
import { UserService } from '../../_Services/User.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './Member-list.component.html',
  styleUrls: ['./Member-list.component.css']
 })

export class MemberListComponent implements OnInit {
  users: User[];
  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.loadUsers();
    this.route.data.subscribe(user => {
      this.users = user['users']
    });
  }

  // loadUsers() {
  //   return this.userService.getUsers().subscribe(
  //     (user: User[]) => {
  //       this.users = user;
  //     },
  //     error => {
  //       this.alertify.Error(error);
  //     }
  //   );
  // }
}
