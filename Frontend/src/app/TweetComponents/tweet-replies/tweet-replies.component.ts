import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BookmarkService } from 'src/app/shared/services/bookmark.service';
import { DeleteTweetSharedService } from 'src/app/shared/services/delete-tweet-shared.service';
import { IncreaseReplyCountServiceService } from 'src/app/shared/services/increase-reply-count-service.service';
import { LikeService } from 'src/app/shared/services/like.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { TweetService } from 'src/app/shared/services/tweet.service';
import { TweetDTO } from 'src/app/shared/_interfaces/tweetDTO';
import { environment } from 'src/environments/environment';
import { PostTweetComponent } from '../post-tweet/post-tweet.component';

@Component({
  selector: 'app-tweet-replies',
  templateUrl: './tweet-replies.component.html',
  styleUrls: ['./tweet-replies.component.scss']
})
export class TweetRepliesComponent implements OnInit {

  @Input() replies: TweetDTO[];
  currentUser: any;

  @ViewChild(PostTweetComponent) postTweetComponent: PostTweetComponent;
  modalWrapper: HTMLElement;

  tweetId: number;
  pageSize: number = 2;

  @Output() onReply: EventEmitter<any> = new EventEmitter();

  constructor(private _tokenService: TokenService,
     private _tweetService: TweetService,
     private _likeService: LikeService,
     private _bookmarkService:BookmarkService,
     private route: ActivatedRoute,
     private _increaseReplyCountSharedService: IncreaseReplyCountServiceService,
     private _deleteTweetSharedService: DeleteTweetSharedService) { }

  ngOnInit(): void {
    this.modalWrapper = document.querySelector('.modal-wrapper');
    this.tweetId = this.route.snapshot.params['id'];
    this.currentUser = this._tokenService.getUser();
  }
  
  isDarkModeEnabled = () => (window.localStorage.getItem('darkmode') == 'dark');

  addReply(id) {
    this.onReply.emit({ id: id, action: 'reply' });
  }

  addRetweet(id) {
    this.onReply.emit({ id: id, action: 'retweet' });
  }

  getDate(date: Date){
    let d = new Date(date);
    let momentOfPost = moment(date).add(-d.getTimezoneOffset(), 'minutes');
    let momentOfNow = moment();
    var difference = momentOfNow.diff(momentOfPost, "days");
    if(difference == 0)
    {
      //within few hours
      return momentOfPost.format("h:mma");
    }
    else {
      if(momentOfNow.year() - momentOfPost.year() >= 1)
      {
        return momentOfPost.format("MMM D, YYYY")
      }
      return momentOfPost.format("MMM D"); // within the same year
    }
  }
  getDateOfToolTip(date: Date){
    let d = new Date(date);
    let momentOfPost = moment(date).add(-d.getTimezoneOffset(), 'minutes');
    return momentOfPost.format("h:mm A . MMM D, YYYY");
  }

  deleteTweet(id: number) {
    console.log(id);
    this._tweetService.deleteTweet(id).subscribe((res) => {
      // var tweet = this.replies.find(t => t.id == id);
      // this.replies.splice(this.replies.indexOf(tweet),1);
      this.replies = [];
      this.getReplies(this.pageSize,1);
      this._deleteTweetSharedService.sendClickEvent();
    });
  }

  public createResourcesPath = (serverPath: string) => {
    return `${environment.apiUrl}/${serverPath}`;
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
    this.replies.forEach((tweet) => {
      if (tweet.id == tweetId) {
        tweet.isLiked = !tweet.isLiked;
        tweet.likeCount = isLiked ? tweet.likeCount - 1 : tweet.likeCount + 1;
      }
    });
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
    this.replies.forEach((tweet) => {
      if (tweet.id == tweetId) {
        tweet.isBookmarked = !tweet.isBookmarked;
        tweet.bookmarkCount = isBookmarked
          ? tweet.bookmarkCount - 1
          : tweet.bookmarkCount + 1;
      }
    });
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

  openPostTweetWindow(tweetId:number, action:string) {
    console.log(tweetId);
    console.log(action);
    this.postTweetComponent.TweetId = tweetId;
    this.postTweetComponent.action = action;
    this._increaseReplyCountSharedService.TweetId = tweetId;
    this.modalWrapper.classList.add('modal-wrapper-display');
    this.postTweetComponent.openPostTweetWindow();
  }

  closePostTweetWindow() {
    var postText: HTMLSpanElement = document.querySelector(
      '.dark-mode-1.light-text.reply-text-input'
    );
    postText.innerText = '';
    // this.imageUrls = [];
    // this.videoUrls = '';
    // this.imageFiles = [];
    // this.videoFile = null;
    // this.imagesNames = [];
    // this.videoName = null;

    var videoList = document.querySelector('.video-list');
    if (videoList.firstChild != null) {
      videoList.firstChild.remove();
    }
  }

  changeSuccessful() {
    if(this.postTweetComponent.action == "reply")
    { 
      this.replies.forEach(reply => {
        if(this.postTweetComponent.TweetId == reply.id)
        { 
          reply.replyCount++;
        }
      })
    }
    console.log("change successful");
    // this.tweet.retweetCount++;
  }

  getReplies(pageSize: number, pageNumber: number) {
    if(pageNumber == 1)
    { 
      console.log("Page 1");
      document.querySelector('.load-more-btn').classList.remove('d-none');
      document
        .querySelector('#all-caught-up-text')
        .classList.add('d-none');
    }
    this._tweetService
      .getReplies(this.tweetId, pageSize, pageNumber)
      .subscribe((res) => {
        if (res.length > 0) {
          this.replies.push(...res);
        } else {
          document.querySelector('.load-more-btn').classList.add('d-none');
          document
            .querySelector('#all-caught-up-text')
            .classList.remove('d-none');
        }
      });
  }
}
