import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';

// Manually sending Token to Server
// const httpheaderOptions = {
//   headers: new HttpHeaders ({
//     'Authorization': 'Bearer ' + localStorage.getItem('Token')
//   })
// };

@Injectable({
  providedIn: 'root'
})

export class UserService {
baseUrl = environment.ApiUrl + 'Users/';
constructor(private http: HttpClient) { }

getUsers(): Observable<User[]> {
// return this.http.get<User[]>(this.baseUrl , httpheaderOptions);
return this.http.get<User[]>(this.baseUrl) ;
}

getUser(id): Observable<User> {
 // return this.http.get<User>(this.baseUrl + id, httpheaderOptions);
 return this.http.get<User>(this.baseUrl + id);
}


}