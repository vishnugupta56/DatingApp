import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { PaginatedResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';

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

getUsers(pageNumber?, pageSize?, userParams?): Observable<PaginatedResult<User[]>> {
  // return this.http.get<User[]>(this.baseUrl , httpheaderOptions);
  const paginatedResilt: PaginatedResult<User[]> = new PaginatedResult<User[]>();
  let params = new HttpParams();

  if (pageNumber != null && pageSize != null) {
    params  = params.append('PageNumber', pageNumber);
    params = params.append('PageSize', pageSize);
  }
  if(userParams != null) {
    params = params.append('MinAge', userParams.minAge);
    params = params.append('MaxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('OrderBy', userParams.orderBy);
  }
  return this.http.get<User[]>(this.baseUrl, { observe: 'response', params} ).pipe(
    map(response => {
      paginatedResilt.result = response.body;
      if (response.headers.get('Pagination') != null) {
         paginatedResilt.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResilt;
    })
  ) ;
}

getUser(id): Observable<User> {
 // return this.http.get<User>(this.baseUrl + id, httpheaderOptions);
 return this.http.get<User>(this.baseUrl + id);
}

UpdateUer(id: number , user: User) {
return this.http.put(this.baseUrl + id, user);
}

SetMainPhoto( userId: number, id: number) {
return this.http.post(this.baseUrl + userId + '/photos/' + id + '/setMain'  , {});
}

DeletePhoto( userId: number, id: number) {
  return this.http.delete(this.baseUrl + userId + '/photos/' + id);
}
}
