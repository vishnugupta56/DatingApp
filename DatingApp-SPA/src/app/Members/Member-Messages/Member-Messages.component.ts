import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Messages } from 'src/app/_models/Messages';
import { UserService } from 'src/app/_Services/User.service';
import { AuthService } from 'src/app/_Services/Auth.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { format } from 'url';
import { NgForm } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './Member-Messages.component.html',
  styleUrls: ['./Member-Messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm', {static: true}) messageForm: NgForm;
 @Input() recipientId: number;
 messages: Messages[];
 newMessage: any = {};
 constructor(private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserID = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
    .pipe(
      tap(messages => {
        for (let i = 0; i < messages.length; i++) {
           if (!messages[i].isRead && messages[i].recipientId === currentUserID) {
             this.userService.MarkMessageAsRead(messages[i].id, currentUserID);
           }
        }
      })
    )
    .subscribe(data => {
      this.messages = data;
    }, error => {
      this.alertify.Error(error);
    });
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.SendMessage(this.authService.decodedToken.nameid, this.newMessage)
    .subscribe((message: Messages) => {
      this.messages.unshift(message);
    });
    this.messageForm.reset();
  }

}
