import { PostTweetService } from './../shared/services/post-tweet.service';
import { TweetDTO } from './../shared/_interfaces/tweetDTO';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TweetService } from '../shared/services/tweet.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PostTweetComponent } from '../TweetComponents/post-tweet/post-tweet.component';
import { environment } from 'src/environments/environment';
import { DeleteTweetSharedService } from '../shared/services/delete-tweet-shared.service';
import { Subscription } from 'rxjs';
import { AccountService } from '../shared/services/account.service';
import { DetailsUserDTO } from '../shared/_interfaces/detailsUserDTO.model';
import { IncreaseReplyCountServiceService } from '../shared/services/increase-reply-count-service.service';
import { SignalRService } from '../shared/services/signal-r.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  deleteTweetClickEventSubscription: Subscription;
  increaseReplyCountClickEventSubscription: Subscription;
  homePageTweets: TweetDTO[] = [];
  modal: HTMLElement;
  modalWrapper: HTMLElement;
  modalInput: HTMLInputElement;
  page: string;
  display: boolean;
  currentUser: DetailsUserDTO;
  currentPageNumber: number = 1;
  pageSize: number = 2;

  @ViewChild(PostTweetComponent) postTweetComponent: PostTweetComponent;
  constructor(
    private _tweetService: TweetService,
    private _router: Router,
    private route: ActivatedRoute,
    public postTweetService: PostTweetService,
    private _accountService: AccountService,
    private _deleteTweetSharedService: DeleteTweetSharedService,
    private _increaseReplyCountSharedService: IncreaseReplyCountServiceService,
    public signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.getTweets(this.pageSize, this.currentPageNumber);
    this.modalWrapper = document.querySelector('.modal-wrapper');
    this._accountService.getCurrentUser().subscribe((data) => {
      this.currentUser = data;
    });

    this.deleteTweetClickEventSubscription = this._deleteTweetSharedService
      .getClickEvent()
      .subscribe(() => {
        this.changeSuccessful();
      });

    this.increaseReplyCountClickEventSubscription = this._increaseReplyCountSharedService
      .getClickEvent()
      .subscribe(() => {
        this.increaseCount();
      });
  }

  isDarkModeEnabled = () => window.localStorage.getItem('darkmode') == 'dark';

  getTweets(pageSize: number, pageNumber: number) {
    this.currentPageNumber = pageNumber;
    if(pageNumber == 1)
    {
      document.querySelector('.load-more-btn').classList.remove('d-none');
      document
        .querySelector('#all-caught-up-text')
        .classList.add('d-none');
    }
    this._tweetService
      .getHomePageTweets(pageSize, pageNumber)
      .subscribe((res) => {
        if (res.length > 0) {
          this.homePageTweets.push(...res);
        } else {
          document.querySelector('.load-more-btn').classList.add('d-none');
          document
            .querySelector('#all-caught-up-text')
            .classList.remove('d-none');
        }
      });
  }

  openPostTweetWindow(obj?) {
    this.postTweetComponent.TweetId = +obj?.id;
    this.postTweetComponent.action = obj?.action;
    this.modalWrapper.classList.add('modal-wrapper-display');
    this.postTweetComponent.openPostTweetWindow();
  }

  closePostTweetWindow() {
    this.modalWrapper.classList.remove('modal-wrapper-display');
  }

  public createResourcesPath = (serverPath: string) => {
    return `${environment.apiUrl}/${serverPath}`;
  };

  changeSuccessful() {
    this.homePageTweets = [];
    this.getTweets(this.pageSize, 1);
  }

  increaseCount() {
    this.homePageTweets.forEach((tweet) => {
      if(tweet.id == this._increaseReplyCountSharedService.TweetId) {
        tweet.replyCount++;
      }
    })
    this.signalRService.broadcastData(
      this.homePageTweets.find((t) => t.id == this._increaseReplyCountSharedService.TweetId),
      this.currentUser['username']
    );
  }
}
