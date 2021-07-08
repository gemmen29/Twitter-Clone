import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AddTweetDTO } from '../_interfaces/addTweetDTO';
import { TweetDTO } from '../_interfaces/tweetDTO';
import { TweetWithRepliesDTO } from '../_interfaces/tweetWithRepliesDTO.model';

const tweetApi = environment.apiUrl + '/api/Tweets';
const uploadApi = environment.apiUrl + '/api/Upload';
@Injectable({
  providedIn: 'root',
})
export class TweetService {
  constructor(private httpClient: HttpClient) {}

  getHomePageTweets(
    pageSize: number,
    pageNumber: number
  ): Observable<TweetDTO[]> {
    return this.httpClient
      .get<TweetDTO[]>(`${tweetApi}/HomePageTweets/${pageSize}/${pageNumber}`)
      .pipe(
        catchError((err) => {
          return throwError(
            err.message || 'Internal Server error contact site adminstarator'
          );
        })
      );
  }

  getTweets(
    username: string,
    pageSize: number,
    pageNumber: number
  ): Observable<TweetDTO[]> {
    return this.httpClient
      .get<TweetDTO[]>(
        `${tweetApi}/tweets/${username}/${pageSize}/${pageNumber}`
      )
      .pipe(
        catchError((err) => {
          return throwError(
            err.message || 'Internal Server error contact site adminstarator'
          );
        })
      );
  }

  getReplies(
    tweetId: number,
    pageSize: number,
    pageNumber: number
  ): Observable<TweetDTO[]> {
    return this.httpClient
      .get<TweetDTO[]>(
        `${tweetApi}/TweetReplies/${tweetId}/${pageSize}/${pageNumber}`
      )
      .pipe(
        catchError((err) => {
          return throwError(
            err.message || 'Internal Server error contact site adminstarator'
          );
        })
      );
  }

  getRetweetsAndReplies(
    username: string,
    pageSize: number,
    pageNumber: number
  ): Observable<TweetDTO[]> {
    return this.httpClient
      .get<TweetDTO[]>(
        `${tweetApi}/retweets-and-replies/${username}/${pageSize}/${pageNumber}`
      )
      .pipe(
        catchError((err) => {
          return throwError(
            err.message || 'Internal Server error contact site adminstarator'
          );
        })
      );
  }

  getTweet(id: number): Observable<TweetDTO> {
    return this.httpClient.get<TweetDTO>(tweetApi + '/' + id);
  }

  uploadTweetImage(formData: FormData): Observable<any> {
    return this.httpClient
      .post(uploadApi + '/Image', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        catchError((err) => {
          return throwError(
            err.message || 'Internal Server error contact site adminstarator'
          );
        })
      );
  }

  uploadTweetVideo(formData: FormData): Observable<any> {
    return this.httpClient
      .post(uploadApi + '/Video', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        catchError((err) => {
          return throwError(
            err.message || 'Internal Server error contact site adminstarator'
          );
        })
      );
  }

  addTweet(tweet: AddTweetDTO): Observable<any> {
    return this.httpClient.post<any>(tweetApi, tweet).pipe(
      catchError((err) => {
        return throwError(
          err.message || 'Internal Server error contact site adminstarator'
        );
      })
    );
  }

  addReply(id: number, tweet: AddTweetDTO): Observable<any> {
    return this.httpClient.post<any>(tweetApi + '/ReplyToTweet/' + id, tweet);
  }

  deleteTweet(id: number) {
    console.log(tweetApi + '/' + id);
    return this.httpClient.delete(tweetApi + '/' + id).pipe(
      catchError((err) => {
        return throwError(
          err.message || 'Internal Server error contact site adminstarator'
        );
      })
    );
  }
}
