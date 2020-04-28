import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { PaginatedResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';
import { Messages } from '../_models/Messages';

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

getUsers(pageNumber?, pageSize?, userParams?, likeParams?): Observable<PaginatedResult<User[]>> {
  // return this.http.get<User[]>(this.baseUrl , httpheaderOptions);
  const paginatedResilt: PaginatedResult<User[]> = new PaginatedResult<User[]>();
  let params = new HttpParams();

  if (pageNumber != null && pageSize != null) {
    params  = params.append('PageNumber', pageNumber);
    params = params.append('PageSize', pageSize);
  }
  if (userParams != null) {
    params = params.append('MinAge', userParams.minAge);
    params = params.append('MaxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('OrderBy', userParams.orderBy);
  }
  if (likeParams === 'likers')  {
    params = params.append('liker', 'true' );
  }
  if (likeParams === 'likees')  {
    params = params.append('likee', 'true' );
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

SendLike(userid: number, recipientId: number) {
  return this.http.post(this.baseUrl + userid + '/like/' + recipientId, {});
}

GetMessages( id: number, pageNumber?,pageSize? , messageContainer?) {
  const paginatedResult: PaginatedResult<Messages[]> = new PaginatedResult<Messages[]>();

  let params = new HttpParams();
  params = params.append('MessageContainer' , messageContainer);
  if (pageNumber != null && pageSize != null) {
    params  = params.append('PageNumber', pageNumber);
    params = params.append('PageSize', pageSize);
  }
  return this.http.get<Messages[]>(this.baseUrl + id + '/messages', { observe: 'response', params})
  .pipe(
    map(response => {
    paginatedResult.result = response.body;
    if (response.headers.get('Pagination') != null ) {
      paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
     }
    return paginatedResult;
    })
  );
}

 getMessageThread(id: number, recipientId: number) {
    return this.http.get<Messages[]>(this.baseUrl + id + '/messages/thread/' + recipientId);
 }

 SendMessage(id: number, message: Messages) {
   return this.http.post(this.baseUrl + id + '/Messages', message);
 }

 DeleteMessage(id: number, userid: number) {
   return this.http.post(this.baseUrl + userid + '/Messages/' + id, {});
 }

 MarkMessageAsRead(id: number, userid: number) {
   return this.http.post(this.baseUrl + userid + '/Messages/' + id + '/read', {}).subscribe();
 }
}
