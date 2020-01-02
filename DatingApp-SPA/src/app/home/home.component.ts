import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_Services/Auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  values: any;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() { this.getValues(); }

  RegisterToggle(status: boolean) {
    this.registerMode = status;
  }
loggedIn()
{
  return this.auth.loggedIn();
}

  getValues() {
    this.http.get('http://localhost:5000/api/values').subscribe(response => {
      this.values = response;
    }, error => {
      console.log(error);
    });

  }

}
