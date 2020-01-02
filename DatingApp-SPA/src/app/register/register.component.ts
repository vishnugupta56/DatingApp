import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
@Input() ValuesForHome: any;
@Output() ValueFromRegister = new EventEmitter();
model: any = { };
  constructor(private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  register()  {
  this.authService.register(this.model).subscribe(() => {
    this.alertify.Success('user registered successfully');
  }, error => {
    this.alertify.Error(error);
  });
  }

  cancel()   {
    this.ValueFromRegister.emit(false);
  }

}
