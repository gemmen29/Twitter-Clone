import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AddRetweetDTO } from '../_interfaces/addRetweetDTO';
import { RetweetDetailsDTO } from '../_interfaces/retweetDetailsDTO.model';

const retweetApi = environment.apiUrl + "/api/Retweet";

@Injectable({
  providedIn: 'root'
})
export class RetweetService {

  constructor(private httpClient: HttpClient) { }

  addRetweet(retweet: AddRetweetDTO): Observable<any> {
    return this.httpClient.post<any>(retweetApi, retweet).pipe(catchError((err) => {
      return throwError(err.message || "Internal Server error contact site adminstarator");
    }));
  }

  deleteRetweet(id: number) {
    return this.httpClient.delete(retweetApi + "/" + id).pipe(catchError((err) => {
      return throwError(err.message || "Internal Server error contact site adminstarator");
    }));
  }

  getRetweets(username: string, pageSize: number, pageNumber: number): Observable<RetweetDetailsDTO[]> {
    return this.httpClient.get<RetweetDetailsDTO[]>(`${retweetApi}/${pageSize}/${pageNumber}`).pipe(catchError((err) => {
      return throwError(err.message || "Internal Server error contact site adminstarator");
    }));
  }

  // getTweet(id: number): Observable<TweetWithRepliesDTO> {
  //   return this.httpClient.get<TweetWithRepliesDTO>(tweetApi + '/' + id);
  // }
}
