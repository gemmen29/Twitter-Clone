import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from '../shared/services/account.service';
import { BookmarkService } from '../shared/services/bookmark.service';
import { DeleteTweetSharedService } from '../shared/services/delete-tweet-shared.service';
import { FollowingService } from '../shared/services/following.service';
import { IncreaseReplyCountServiceService } from '../shared/services/increase-reply-count-service.service';
import { LikeService } from '../shared/services/like.service';
import { PostTweetService } from '../shared/services/post-tweet.service';
import { TokenService } from '../shared/services/token.service';
import { TweetService } from '../shared/services/tweet.service';
import { DetailsUserDTO } from '../shared/_interfaces/detailsUserDTO.model';
import { TweetDTO } from '../shared/_interfaces/tweetDTO';
import { PostTweetComponent } from '../TweetComponents/post-tweet/post-tweet.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  deleteTweetClickEventSubscription: Subscription;
  increaseReplyCountClickEventSubscription: Subscription;
  
  tweets: TweetDTO[] = []
  followUsersForModal:DetailsUserDTO[] = []
  modalHeader:string = ''
  currentSelectedTabHeader:string
  currentPageNumber: number = 1;
  currentModalNumber: number = 1;
  pageSize : number = 1;
  modal: HTMLElement;
  modalWrapper: HTMLElement;
  currentUser:DetailsUserDTO;
  currentOpenedUserProfile:DetailsUserDTO;

  @ViewChild(PostTweetComponent) postTweetComponent: PostTweetComponent;
  constructor(
    private _tweetService: TweetService, 
    private _router: Router,
    private route: ActivatedRoute,
    public postTweetService: PostTweetService,
    private _followingService: FollowingService,
    private _likeService: LikeService,
    private _bookmarkService: BookmarkService,
    private _accountService: AccountService,
    private _deleteTweetSharedService: DeleteTweetSharedService,
    private _increaseReplyCountSharedService: IncreaseReplyCountServiceService) { }



  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const usernameProfile = params.get('username');
      this._accountService.getUserByUsername(usernameProfile).subscribe(
        (data)=>{
          this.tweets = [];
          this.currentPageNumber = 1;
          this.currentModalNumber = 1;
          this.currentSelectedTabHeader = 'tweets';
          this.changeActiveTabUI(this.currentSelectedTabHeader)
          this.currentOpenedUserProfile = data;
          this.getTweetsForSelectedTab()
          this.getFollowing()
          this.getFollowers()
      })
    })
    
    this.modalWrapper = document.querySelector('.modal-wrapper');
    this._accountService.getCurrentUser().subscribe(
      (data)=>{
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
  
  getFollowing() {
    this._followingService.getFollowingByPage(this.currentOpenedUserProfile?.userName, this.pageSize, this.currentModalNumber++).subscribe((res) => {
      if(res.length > 0) {
        this.followUsersForModal.push(...res);        
      } else {
        this.hideOrShowLoadMoreUsersButton()
      }
    });
  }

  getFollowers() {
    this._followingService.getFollowersByPage(this.currentOpenedUserProfile?.userName, this.pageSize, this.currentModalNumber++).subscribe((res) => {
      if(res.length > 0) {
        this.followUsersForModal.push(...res);
      } else {
        this.hideOrShowLoadMoreUsersButton()
      }
    });
  }

  getTweets () {
    console.log(this.currentOpenedUserProfile?.userName);
    this._tweetService.getTweets(this.currentOpenedUserProfile?.userName, this.pageSize, this.currentPageNumber++).subscribe((res) => {
      if(res.length > 0) {
        this.tweets.push(...res);
      } else {
        this.hideLoader()
        this.hideOrShowLoadMoreButton()
      }
    });
  }

  getRetweetsAndReplies () {
    this._tweetService.getRetweetsAndReplies(this.currentOpenedUserProfile?.userName, this.pageSize, this.currentPageNumber++).subscribe((res) => {
      if(res.length > 0) {
        this.tweets.push(...res);
      } else {
        this.hideLoader()
        this.hideOrShowLoadMoreButton()
      }
    });
  }

  getLikes() {
    this._likeService.getLikesByPage(this.currentOpenedUserProfile?.userName, this.pageSize, this.currentPageNumber++).subscribe((res) => {
      if(res.length > 0) {
        this.tweets.push(...res);
      } else {
        this.hideLoader()
        this.hideOrShowLoadMoreButton()
      }
    })
  }

  getBookmarks() {
    this._bookmarkService.getBookmarksByPage(this.currentOpenedUserProfile?.userName, this.pageSize, this.currentPageNumber++).subscribe((res) => {
      if(res.length > 0) {
        this.tweets.push(...res);
      } else {
        this.hideLoader()
        this.hideOrShowLoadMoreButton()
      }
    })
  }

  openPostTweetWindow(obj) {
    console.log(obj);
    this.postTweetComponent.TweetId = +obj?.id;
    this.postTweetComponent.action = obj?.action;
    this.modalWrapper.classList.add('modal-wrapper-display');
    this.postTweetComponent.openPostTweetWindow();
  }

  closePostTweetWindow() {
    this.modalWrapper.classList.remove('modal-wrapper-display');
  }

  public createResourcesPath = (serverPath: string) => {
    return `${environment.apiUrl}/${serverPath}`
  }

  changeTab(tabHeader) {
    this.currentSelectedTabHeader = tabHeader.parentElement.getAttribute('data-value')
    
    this.changeActiveTabUI(this.currentSelectedTabHeader)
    this.currentPageNumber = 1
    this.tweets = []
    this.getTweetsForSelectedTab()
    this.hideOrShowLoadMoreButton()
    this.showLoader()
  }

  changeActiveTabUI(tabHeader:string) {
    // this.tweets = [];
    const liElements = document.getElementById('tweet-tabs').children
    
    for (let element of Array.from(liElements)) {
      if(element.classList.contains('active'))
        element.classList.remove('active')        
      if(element.getAttribute('data-value') === tabHeader)
        element.classList.add('active')
    }
  }

  getTweetsForSelectedTab() {
    switch (this.currentSelectedTabHeader) {
      case 'tweets': this.getTweets(); break;
      case 'retweets_replies': this.getRetweetsAndReplies(); break;
      case 'likes': this.getLikes(); break;
      case 'bookmarks': this.getBookmarks(); break;
      default: break;
    }
  }

  hideLoader() {
    setTimeout(() => {
      document.querySelector(".loader")?.classList.add("d-none");
      document.querySelector("#no-tweets")?.classList.remove("d-none");
    },700)
  }

  showLoader() {
    document.querySelector(".loader")?.classList.remove("d-none");
    document.querySelector("#no-tweets")?.classList.add("d-none");
  }

  getFollowersOrFollowing() {
    switch (this.modalHeader) {
      case 'Following': this.getFollowing(); break;
      case 'Followers': this.getFollowers(); break;
      default: break;
    }
  }

  openFollowModal(element) {
    this.currentModalNumber = 1
    this.followUsersForModal = []

    if(element.id === 'followings') {
      this.modalHeader = 'Following'
    } else {
      this.modalHeader = 'Followers'
    }
      this.getFollowersOrFollowing();
  }

  hideOrShowLoadMoreButton() {
    document.querySelector('.load-more-btn')?.classList.toggle('d-none')
    document.querySelector('#all-caught-up-text')?.classList.toggle('d-none')
  }

  hideOrShowLoadMoreUsersButton() {
    document.querySelector('.load-more-users-btn')?.classList.toggle('d-none')
    document.querySelector('#no-more-users-text')?.classList.toggle('d-none')
  }

  follow(userId: string) {
    this._followingService.follow(userId).subscribe(
      (data) => {
        this.currentOpenedUserProfile.followingCount++;
      },
      (error) => {
        //  this.errorMsg = error;
      }
    );
    this.updateIsFollowedValue(userId);
  }

  private updateIsFollowedValue(userId: string) {
    this.followUsersForModal.forEach((user) => {
      if(user.id == userId) {
        user.isFollowedByCurrentUser = !user.isFollowedByCurrentUser;
      }
    })
  }

  unfollow(userId: string) {
    this._followingService.unfollow(userId).subscribe(
      (data) => {
        this.currentOpenedUserProfile.followingCount--;
      },
      (error) => {
        //  this.errorMsg = error;
      }
    );
    this.updateIsFollowedValue(userId);
  }

  changeSuccessful(){
    this.currentPageNumber = 1;
    this.tweets = [];
    this.getTweetsForSelectedTab();
  }

  increaseCount() {
    this.tweets.forEach((tweet) => {
      if(tweet.id == this._increaseReplyCountSharedService.TweetId) {
        tweet.replyCount++;
      }
    })
  }
}
