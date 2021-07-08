import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FollowingDetailsDTO } from '../_interfaces/followingDetailsDTO.model';



@Injectable({
  providedIn: 'root'
})
export class UsersInteractionsService {

  constructor(private httpClient: HttpClient) { }
  followUser(followingId): any {
     this.httpClient.post(environment.apiUrl + "/user/follow/"+followingId,null).pipe(catchError((err)=>
    {
       return throwError(err.message ||"Internal Server error contact site adminstarator");
    }));
  }

  unfollowUser(followingId): any {
    this.httpClient.post(environment.apiUrl + "/user/unfollow/"+followingId,null).pipe(catchError((err)=>
   {
      return throwError(err.message ||"Internal Server error contact site adminstarator");
   }));
 }

 getFollowingList(): Observable<FollowingDetailsDTO[]> {
  return this.httpClient.get<FollowingDetailsDTO[]>(environment.apiUrl + "/user/following").pipe(catchError((err)=>
 {
    return throwError(err.message ||"Internal Server error contact site adminstarator");
 }));
}

}
