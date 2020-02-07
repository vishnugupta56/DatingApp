import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
@Input() ValuesForHome: any;
@Output() ValueFromRegister = new EventEmitter();
RegisterForm: FormGroup;
bsConfig: Partial<BsDatepickerConfig>;  // we make class partial when we want to make all manatory fields to non-mandatory
user: User;
  constructor(private authService: AuthService, private router: Router,
              private alertify: AlertifyService, private fb: FormBuilder) { }

  ngOnInit() {
    // using Form Group
    // this.RegisterForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', [Validators.required])
    // }, this.PaswordCompare);

    // using FormBuilder
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.RegisterationForm();
  }

RegisterationForm() {
  this.RegisterForm = this.fb.group({
    gender: ['male'],
    username: ['', Validators.required],
    knownAs: ['', Validators.required],
    dateOfBirth: [null, Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, {validator: this.PaswordCompare});
 }
PaswordCompare(g: FormGroup) {
  return g.get('password').value === g.get('confirmPassword').value ? null : {Missmatch: true};
}
  register()  {
    if (this.RegisterForm.valid) {
      this.user = Object.assign({}, this.RegisterForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alertify.Success('User Created Successfully');
      }, error => {
        this.alertify.Error(error);
      }, () => {
      this.user.username = this.user.username.toLowerCase();
      this.authService.login(this.user).subscribe(() => {
        this.router.navigate(['/memberslists']);
      });
      });
    }
  // this.authService.register(this.model).subscribe(() => {
  //   this.alertify.Success('user registered successfully');
  // }, error => {
  //   this.alertify.Error(error);
  // });
  }

  cancel()   {
    this.ValueFromRegister.emit(false);
  }

}
