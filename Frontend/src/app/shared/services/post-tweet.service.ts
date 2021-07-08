import { Injectable } from '@angular/core';
import { AddTweetDTO } from '../_interfaces/addTweetDTO';
import { ImageDTO } from '../_interfaces/imageDTO';
import { VideoDTO } from '../_interfaces/videoDTO';
import { TweetService } from './tweet.service';

@Injectable({
  providedIn: 'root'
})
export class PostTweetService {



  constructor(private _tweetService: TweetService) {

  }



}
