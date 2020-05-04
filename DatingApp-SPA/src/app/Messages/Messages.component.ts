import { Component, OnInit } from '@angular/core';
import { UserService } from '../_Services/User.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Messages } from '../_models/Messages';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_Services/Auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './Messages.component.html',
  styleUrls: ['./Messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Messages[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
    this.messages = data['messages'].result;
    this.pagination = data['messages'].pagination;
    });
  }

  pageChanges(event: any) {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
  loadMessages() {
    this.userService.GetMessages(this.authService.decodedToken.nameid, this.pagination.currentPage
      , this.pagination.itemPerPage, this.messageContainer)
    .subscribe((res: PaginatedResult<Messages[]>) => {
      this.messages = res.result;
      this.pagination.itemPerPage = 5;
      this.pagination.totalItems = res.pagination.totalItems;
      this.pagination.totalPages = res.pagination.totalPages;
    }, error => {
      this.alertify.Error(error);
    });
  }

  deleteMessage(id: number) {
    this.alertify.confirm('Are you sure you want to delete this message', () => {
      this.userService.DeleteMessage(id, this.authService.decodedToken.nameid).subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertify.Success('Messages has been deleted');
      }, error => {
        this.alertify.Error('Failed to delete message');
      });

    });
  }



}
