import { HomeComponent } from './../../home/home.component';
import { environment } from './../../../environments/environment';
import { TweetDTO } from '../../shared/_interfaces/tweetDTO';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TokenService } from 'src/app/shared/services/token.service';
import { TweetService } from 'src/app/shared/services/tweet.service';
import { LikeService } from 'src/app/shared/services/like.service';
import { BookmarkService } from 'src/app/shared/services/bookmark.service';
import { SignalRService } from 'src/app/shared/services/signal-r.service';
import { Subscription } from 'rxjs';
import { TweetSharedService } from 'src/app/shared/services/tweet-shared.service';
import * as moment from 'moment';
import { FollowingService } from 'src/app/shared/services/following.service';
import { DeleteTweetSharedService } from 'src/app/shared/services/delete-tweet-shared.service';
// import * as moment from 'moment-timezone';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css'],
})
export class TweetComponent implements OnInit {
  @Input() tweetList: TweetDTO[];

  //tweets: TweetDTO[];
  modal: HTMLElement;
  modalWrapper: HTMLElement;
  currentUser: any;

  @Output() onReply: EventEmitter<any> = new EventEmitter();
  tweetClickEventSubscription: Subscription;
  //deleteTweetClickEventSubscription: Subscription;
  constructor(
    private _tokenService: TokenService,
    private _tweetService: TweetService,
    private _likeService: LikeService,
    private _bookmarkService: BookmarkService,
    private _tweetSharedService: TweetSharedService,
    public signalRService: SignalRService,
    private _followingService: FollowingService,
    private _deleteTweetSharedService: DeleteTweetSharedService
  ) {
    this.tweetClickEventSubscription = this._tweetSharedService
      .getClickEvent()
      .subscribe(() => {
        this.updateValueForSignalR();
      });
  }

  private updateValueForSignalR() {
    var tweetIndex = this.tweetList.findIndex(
      (t) => t.id == this.signalRService.tweet['id']
    );
    if (this.currentUser['username'] === this.signalRService.userName) {
      this.tweetList[tweetIndex] = this.signalRService.tweet;
    } else {
      for (let key in this.tweetList[tweetIndex]) {
        if (key !== 'isLiked' && key !== 'isBookmarked') {
          this.tweetList[tweetIndex][key] = this.signalRService.tweet[key];
        }
      }
    }
  }

  ngOnInit(): void {
    this.currentUser = this._tokenService.getUser();
    this.signalRService.startConnection();
    this.signalRService.addBroadcastDataListener();
  }

  public createResourcesPath = (serverPath: string) => {
    return `${environment.apiUrl}/${serverPath}`;
  };

  addReply(id) {
    this.onReply.emit({ id: id, action: 'reply' });
  }

  addRetweet(id) {
    this.onReply.emit({ id: id, action: 'retweet' });
  }

  isDarkModeEnabled = () => window.localStorage.getItem('darkmode') == 'dark';

  deleteTweet(id: number) {
    console.log(id);
    this._tweetService.deleteTweet(id).subscribe((res) => {
      // var tweetIndex = this.tweetList.findIndex((t) => t.id == id);
      // this.tweetList.splice(tweetIndex, 1);
      this._deleteTweetSharedService.sendClickEvent();
    });
  }

  likeOrDislike(tweetId: number, isLiked: boolean) {
    if (!isLiked) {
      isLiked = false;
      this._likeService.like(tweetId).subscribe(
        (data) => { },
        (error) => {
          //  this.errorMsg = error;
        }
      );
    } else {
      isLiked = true;
      this._likeService.dislike(tweetId).subscribe(
        (data) => { },
        (error) => {
          //  this.errorMsg = error;
        }
      );
    }
    this.tweetList.forEach((tweet) => {
      if (tweet.id == tweetId) {
        tweet.isLiked = !tweet.isLiked;
        tweet.likeCount = isLiked ? tweet.likeCount - 1 : tweet.likeCount + 1;
      }
    });

    this.signalRService.broadcastData(
      this.tweetList.find((t) => t.id == tweetId),
      this.currentUser['username']
    );
  }

  bookmarkOrRemoveBookmark(tweetId: number, isBookmarked: boolean) {
    if (!isBookmarked) {
      isBookmarked = false;
      this._bookmarkService.bookmark(tweetId).subscribe(
        (data) => { },
        (error) => {
          //  this.errorMsg = error;
        }
      );
    } else {
      isBookmarked = true;
      this._bookmarkService.removeBookmark(tweetId).subscribe(
        (data) => { },
        (error) => {
          //  this.errorMsg = error;
        }
      );
    }
    this.tweetList.forEach((tweet) => {
      if (tweet.id == tweetId) {
        tweet.isBookmarked = !tweet.isBookmarked;
        tweet.bookmarkCount = isBookmarked
          ? tweet.bookmarkCount - 1
          : tweet.bookmarkCount + 1;
      }
    });

    this.signalRService.broadcastData(
      this.tweetList.find((t) => t.id == tweetId),
      this.currentUser['username']
    );
    //this.tweetList = this.signalRService.tweetList;
  }
  // intial solution
  // getDate(date : Date){
  //    let d = new Date(date);
  //   // console.log(d.getTimezoneOffset());
  //   // d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  //   // a.diff(b, 'days')
  //   return moment(date).add(-d.getTimezoneOffset(), 'minutes').fromNow();
  // }
  getDate(date: Date) {
    //return moment.tz(date, moment.tz.guess()).format("h:mma");
    let d = new Date(date);
    let momentOfPost = moment(date).add(-d.getTimezoneOffset(), 'minutes');
    //let momentOfPost = moment("2021/01/01");
    let momentOfNow = moment();
    var difference = momentOfNow.diff(momentOfPost, 'days');
    if (difference == 0) {
      //within few hours
      return momentOfPost.format('h:mm A');
    } else {
      if (momentOfNow.year() - momentOfPost.year() >= 1) {
        return momentOfPost.format('MMM D, YYYY');
      }
      return momentOfPost.format('MMM D'); // within the same year
    }
    //console.log(difference);
    // console.log(momentOfPost.format("h:mma"));
    // console.log(momentOfNow.format("h:mma"))
    //return moment().format("h:mma");
  }

  getDateOfToolTip(date: Date) {
    //return moment.tz(date, moment.tz.guess()).format("h:mma");
    let d = new Date(date);
    let momentOfPost = moment(date).add(-d.getTimezoneOffset(), 'minutes');
    return momentOfPost.format('h:mm A . MMM D, YYYY');
  }

  getImageClasses(imgCount: number) {
    if (imgCount === 1) {
      return 'img-count-1';
    }

    if (imgCount === 2) {
      return 'img-count-2';
    }

    if (imgCount === 3) {
      return 'img-count-3';
    }

    if (imgCount === 4) {
      return 'img-count-4';
    }
  }

  follow(userId: string) {
    this._followingService.follow(userId).subscribe(
      (data) => { },
      (error) => {
        //  this.errorMsg = error;
      }
    );
    this.updateIsFollowedValue(userId);
  }

  unfollow(userId: string) {
    this._followingService.unfollow(userId).subscribe(
      (data) => { },
      (error) => {
        //  this.errorMsg = error;
      }
    );
    this.updateIsFollowedValue(userId);
  }

  private updateIsFollowedValue(userId: string) {
    this.tweetList.forEach((tweet) => {
      if (tweet.author.id == userId) {
        tweet.author.isFollowedByCurrentUser =
          !tweet.author.isFollowedByCurrentUser;
      }
    });
  }
}
