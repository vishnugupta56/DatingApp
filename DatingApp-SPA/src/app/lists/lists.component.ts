import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { AuthService } from '../_Services/Auth.service';
import { UserService } from '../_Services/User.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_Services/alertify.service';


@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
users: User[];
pagination: Pagination;
likeparam: string;

  constructor(private authservice: AuthService, private userservice: UserService,
              private route: ActivatedRoute, private  alertify: AlertifyService ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users  = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likeparam = 'likers';
  }
  pageChangeds(event: any): void {
    // if (!this.Initiated) {
    this.pagination.currentPage = event.page;
    this.loadUsers();
    // }
   // this.Initiated = !this.Initiated;
  }
  loadUsers() {
    this.userservice.getUsers(this.pagination.currentPage, this.pagination.itemPerPage, null , this.likeparam)
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
