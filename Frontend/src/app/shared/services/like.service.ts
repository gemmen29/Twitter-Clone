import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DetailsUserDTO } from '../_interfaces/detailsUserDTO.model';
import { TweetDTO } from '../_interfaces/tweetDTO';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  constructor(private _http: HttpClient) {}

  like(tweetId: number): Observable<any> {
    let url = `${environment.apiUrl}/tweet/like/${tweetId}`;
    return this._http.post<number>(url, null).pipe(
      catchError((err) => {
        return throwError(
          err.message || 'Internal Server error contact site adminstarator'
        );
      })
    );
  }

  dislike(tweetId: number): Observable<any> {
    let url = `${environment.apiUrl}/tweet/dislike/${tweetId}`;
    return this._http.post<number>(url, null).pipe(
      catchError((err) => {
        return throwError(
          err.message || 'Internal Server error contact site adminstarator'
        );
      })
    );
  }

  getLikesByPage(
    username: string,
    pageSize: number,
    pageNumber: number
  ): Observable<TweetDTO[]> {
    let url = `${environment.apiUrl}/tweet/likes/${username}/${pageSize}/${pageNumber}`;
    return this._http.get<TweetDTO[]>(url).pipe(
      catchError((err) => {
        return throwError(
          err.message || 'Internal Server error contact site adminstarator'
        );
      })
    );
  }

  getTweetLikesByPage(
    tweetId: number,
    pageSize: number,
    pageNumber: number
  ): Observable<DetailsUserDTO[]> {
    let url = `${environment.apiUrl}/tweet/tweetlikes/${tweetId}/${pageSize}/${pageNumber}`;
    return this._http.get<DetailsUserDTO[]>(url).pipe(
      catchError((err) => {
        return throwError(
          err.message || 'Internal Server error contact site adminstarator'
        );
      })
    );
  }
}
