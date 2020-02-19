import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { AlertifyService } from '../../_Services/alertify.service';
import { UserService } from '../../_Services/User.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/Pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './Member-list.component.html',
  styleUrls: ['./Member-list.component.css']
 })

export class MemberListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  initialPage = 1;
  GenderList = [{value: 'male', Display: 'Males'}, {value: 'female', Display: 'females'}];
  userParam: any = {};
  user: User = JSON.parse(localStorage.getItem('User'));



  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.loadUsers();
    this.route.data.subscribe(user => {
      this.users = user['users'].result;
      this.pagination = user['users'].pagination;
      console.log(user['users'].pagination);
    });
    this.userParam.gender = this.user.gender === 'male' ? 'female' : 'male';
    this.userParam.minAge = 18;
    this.userParam.maxAge = 99;
    this.userParam.orderBy = 'lastActive';
  }

  resetFilter() {
    this.userParam.gender = this.user.gender === 'male' ? 'female' : 'male';
    this.userParam.minAge = 18;
    this.userParam.maxAge = 99;
   // this.userParam.orderBy = 'lastActive';
    this.loadUsers();
  }

  pageChangeds(event: any): void {
    // if (!this.Initiated) {
    this.pagination.currentPage = event.page;
    this.loadUsers();
    // }
   // this.Initiated = !this.Initiated;
  }
  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemPerPage, this.userParam, null)
    .subscribe(
      (res: PaginatedResult<User[]>) => {
      this.users = res.result;
    // this.pagination = res.pagination; // we comment this line because if we assign whole values then page change event call twice
      this.pagination.itemPerPage = res.pagination.itemPerPage;
      this.pagination.totalItems = res.pagination.totalItems;
      this.pagination.totalPages = res.pagination.totalPages;
      console.log(this.pagination);
    },
      error => {
        this.alertify.Error(error);
      }
    );
 }
}
