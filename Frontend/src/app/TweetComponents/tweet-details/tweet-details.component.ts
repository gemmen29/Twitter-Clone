import { TweetWithRepliesDTO } from './../../shared/_interfaces/tweetWithRepliesDTO.model';
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TweetService } from 'src/app/shared/services/tweet.service';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/shared/services/token.service';
import { LikeService } from 'src/app/shared/services/like.service';
import * as moment from 'moment';
import { ImageDTO } from 'src/app/shared/_interfaces/imageDTO';
import { VideoDTO } from 'src/app/shared/_interfaces/videoDTO';
import { DetailsUserDTO } from 'src/app/shared/_interfaces/detailsUserDTO.model';
import { AddTweetDTO } from 'src/app/shared/_interfaces/addTweetDTO';
import { HttpEventType } from '@angular/common/http';
import { IncreaseReplyCountServiceService } from 'src/app/shared/services/increase-reply-count-service.service';
import { DeleteTweetSharedService } from 'src/app/shared/services/delete-tweet-shared.service';
import { TweetDTO } from 'src/app/shared/_interfaces/tweetDTO';
import { BookmarkService } from 'src/app/shared/services/bookmark.service';
import { PostTweetComponent } from '../post-tweet/post-tweet.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tweet-details',
  templateUrl: './tweet-details.component.html',
  styleUrls: ['./tweet-details.component.css'],
})
export class TweetDetailsComponent implements OnInit {
  @ViewChild('closebutton') closebutton;

  tweet: TweetDTO;
  replies: TweetDTO[];
  id: number;
  currentUser: any;
  imagesNames: ImageDTO[] = [];
  imageUrls = new Array<string>();
  imageFiles: File[] = [];

  videoName: VideoDTO;
  videoUrls = new String();
  videoFile: File = null;

  progressBarWidth: string = '';
  IsUploading = false;
  UploadingProgress = 0;

  TweetId: number;
  action: string;

  currentPageNumber: number = 1;
  pageSize: number = 2;

  @ViewChild(PostTweetComponent) postTweetComponent: PostTweetComponent;
  modalWrapper: HTMLElement;

  deleteTweetClickEventSubscription: Subscription;

  constructor(
    private tweetService: TweetService,
    private route: ActivatedRoute,
    private _tweetService: TweetService,
    private _tokenService: TokenService,
    private _deleteTweetSharedService: DeleteTweetSharedService,
    private _increaseReplyCountSharedService: IncreaseReplyCountServiceService,
    private _likeService:LikeService,
    private _bookmarkService: BookmarkService
  ) {}

  ngOnInit(): void {
    this.modalWrapper = document.querySelector('.modal-wrapper');
    this.id = this.route.snapshot.params['id'];
    this.tweetService.getTweet(this.id).subscribe(
      (res) => {
        this.tweet = res;
        this.TweetId = this.tweet.id;
        this.tweetService
          .getReplies(this.tweet.id, this.pageSize, this.currentPageNumber)
          .subscribe((res) => {
            //res = this.replies;
            this.replies = res;
            console.log(res);
          });
      },
      (err) => console.log(err)
    );

    this.deleteTweetClickEventSubscription = this._deleteTweetSharedService
    .getClickEvent()
    .subscribe(() => {
      this.decreaseCount();
    });

    this.currentUser = this._tokenService.getUser();
  }

  decreaseCount() {
    this.tweet.replyCount--;
  }

  // changeSuccessful() {
  //   console.log("change successful");
  //   this.tweet.retweetCount++;
  // }

  openPostTweetWindow(obj?) {
    this.postTweetComponent.TweetId = +obj?.id;
    this.postTweetComponent.action = obj?.action;
    this.modalWrapper.classList.add('modal-wrapper-display');
    this.postTweetComponent.openPostTweetWindow();
  }

  openPostTweet(tweetId: number) {
    this.postTweetComponent.TweetId = tweetId;
    this.postTweetComponent.action = "retweet";
    this.modalWrapper.classList.add('modal-wrapper-display');
    this.postTweetComponent.openPostTweetWindow();
  }

  getReplies(pageSize: number, pageNumber: number) {
    this.currentPageNumber = pageNumber;
    if(pageNumber == 1)
    { 
      console.log("Page 1");
      document.querySelector('.load-more-btn').classList.remove('d-none');
      document
        .querySelector('#all-caught-up-text')
        .classList.add('d-none');
    }
    this._tweetService
      .getReplies(this.tweet.id, pageSize, pageNumber)
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

  // private wasInside = false;

  // @HostListener('click')
  // clickInsid() {
  //   console.log("clicked inside")
  //   this.wasInside = true;
  // }

  // @HostListener('document:click')
  // clickout() {
  //   if (!this.wasInside) {
  //   console.log("clicked outside")
  //   }
  //   this.wasInside = false;
  // }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    let element = event.target;
    while (
      element.parentElement &&
      element.parentElement.getAttribute('id') !== 'replyDiv'
    ) {
      element = element.parentElement;
    }

    if (!element.parentElement) {
      // console.log(document.readyState);

      //   document.addEventListener('DOMContentLoaded', () => {
      // });
      this.hideReplyUIChange(event);
    }
  }

  public createResourcesPath = (serverPath: string) => {
    return `${environment.apiUrl}/${serverPath}`;
  };

  isDarkModeEnabled = () => window.localStorage.getItem('darkmode') == 'dark';

  deleteTweet(id: number) {
    this._tweetService.deleteTweet(id).subscribe((res) => {
      this.tweet.replyCount--;
    });
  }

  getDate(date: Date) {
    let d = new Date(date);
    let momentOfPost = moment(date).add(-d.getTimezoneOffset(), 'minutes');
    let momentOfNow = moment();
    var difference = momentOfNow.diff(momentOfPost, 'days');
    if (difference == 0) {
      //within few hours
      return momentOfPost.format('h:mma');
    } else {
      if (momentOfNow.year() - momentOfPost.year() >= 1) {
        return momentOfPost.format('MMM D, YYYY');
      }
      return momentOfPost.format('MMM D'); // within the same year
    }
  }

  getDateOfToolTip(date: Date) {
    let d = new Date(date);
    let momentOfPost = moment(date).add(-d.getTimezoneOffset(), 'minutes');
    return momentOfPost.format('h:mm A . MMM D, YYYY');
  }

  getFullDate(date: Date) {
    let d = new Date(date);
    let momentOfPost = moment(date).add(-d.getTimezoneOffset(), 'minutes');
    return `${momentOfPost.format(
      'h:mm A · MMM D, YYYY · '
    )}Twitter for Browser`;
  }

  showReplyUIChange(event) {
    // const elements = document.querySelectorAll('.reply-at-text, .reply-input-icons, #replyButtonNextToInput');

    // Array.from(elements).map((element) => {
    //   element.classList.toggle('d-flex')
    //   element.classList.toggle('d-none')
    // });

    document.querySelector('#mt5Class')?.classList.remove('mt-5');

    document.querySelector('.reply-at-text')?.classList.remove('d-none');
    document.querySelector('.reply-at-text')?.classList.add('d-flex');

    document.querySelector('.reply-input-icons')?.classList.remove('d-none');
    document.querySelector('.reply-input-icons')?.classList.add('d-flex');

    document
      .querySelector('#replyButtonNextToInput')
      ?.classList.remove('d-flex');
    document.querySelector('#replyButtonNextToInput')?.classList.add('d-none');
  }

  hideReplyUIChange(event) {
    document.querySelector('#mt5Class')?.classList.add('mt-5');

    document.querySelector('.reply-at-text')?.classList.add('d-none');
    document.querySelector('.reply-at-text')?.classList.remove('d-flex');

    document.querySelector('.reply-input-icons')?.classList.add('d-none');
    document.querySelector('.reply-input-icons')?.classList.remove('d-flex');

    document.querySelector('#replyButtonNextToInput')?.classList.add('d-flex');
    document
      .querySelector('#replyButtonNextToInput')
      ?.classList.remove('d-none');
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

  private imgSourceToDisplayInModal: string = '';
  setImgResource(imgSource: string) {
    this.imgSourceToDisplayInModal = imgSource;
  }

  getImageResource() {
    return this.imgSourceToDisplayInModal;
  }

  closeModal() {
    this.closebutton.nativeElement.click();
  }

  closePostTweetWindow() {
    var postText: HTMLSpanElement = document.querySelector(
      '.dark-mode-1.light-text.reply-text-input'
    );
    postText.innerText = '';
    this.imageUrls = [];
    this.videoUrls = '';
    this.imageFiles = [];
    this.videoFile = null;
    this.imagesNames = [];
    this.videoName = null;

    var videoList = document.querySelector('.video-list');
    if (videoList.firstChild != null) {
      videoList.firstChild.remove();
    }
  }

  detectImageFiles(event) {
    let files = event.target.files;
    if (files) {
      if (files.length > 4 || this.videoUrls != '') {
        alert('you are allowed with only one gif or 4 images');
        return;
      }
      this.imageUrls = [];
      this.imageFiles = [];
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageUrls.push(e.target.result);
        };

        reader.onloadstart = (e) => {
          this.IsUploading = true;
        };
        reader.onprogress = (e) => {
          this.UploadingProgress = Math.round((e.loaded * 100) / e.total);
        };
        reader.onloadend = (e) => {
          setTimeout(() => {
            this.IsUploading = false;
            this.imageFiles.push(file);
          }, 1000);
        };

        reader.readAsDataURL(file);
      }
    }
  }

  detectVideoFiles(event) {
    let files = event.target.files;
    if (files) {
      if (files.length > 1 || this.imageUrls.length != 0) {
        alert('you are allowed with only one gif or 4 images');
        return;
      }
      this.videoUrls = '';
      this.videoFile = null;
      var videoList = document.querySelector('.video-list');
      if (videoList.firstChild != null) {
        videoList.firstChild.remove();
      }
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.videoUrls = e.target.result;

          var videoDiv = document.createElement('div');
          videoDiv.setAttribute('class', 'modal-image position-relative');

          var video = document.createElement('video');
          video.setAttribute('style', 'width: 400px; height: 200px;');
          var videoSource = document.createElement('source');
          var container = document.querySelector('.video-list');

          container.appendChild(videoDiv);
          videoDiv.appendChild(video);
          videoSource.setAttribute('src', e.target.result);
          video.appendChild(videoSource);
          video.load();

          var button = document.createElement('button');
          button.setAttribute('class', 'position-absolute');
          button.setAttribute(
            'style',
            'left: 5%; margin-top: 5px; border: none; background: none; border-radius: 50%;'
          );
          button.addEventListener('click', this.deletVideoFromTweet);
          videoDiv.appendChild(button);

          var i = document.createElement('i');
          i.setAttribute(
            'class',
            'fas fa-times-circle fa-2x text-dark bg-light'
          );
          i.setAttribute('style', 'border-radius: 50%');
          button.appendChild(i);
        };

        reader.onloadstart = (e) => {
          this.IsUploading = true;
        };
        reader.onprogress = (e) => {
          this.UploadingProgress = Math.round((e.loaded * 100) / e.total);
        };
        reader.onloadend = (e) => {
          setTimeout(() => {
            this.IsUploading = false;
            this.videoFile = file;
            console.log(this.videoFile);
          }, 3000);
        };

        reader.readAsDataURL(file);
      }
    }
  }

  deletImageFromTweet(event) {
    this.imageUrls.splice(
      this.imageUrls.indexOf(
        event.target.parentElement.previousSibling.getAttribute('src')
      ),
      1
    );
    this.imageFiles.splice(
      event.target.parentElement.previousSibling.getAttribute('data-index')
    );
  }

  deletVideoFromTweet() {
    this.videoUrls = '';
    this.videoFile = null;
    var videoList = document.querySelector('.video-list');
    videoList.firstChild.remove();
  }

  checkBeforeUploading() {
    var postText: HTMLSpanElement = document.querySelector(
      '.dark-mode-1.light-text.reply-text-input'
    );
    if (
      postText.innerText == '' &&
      this.videoUrls == '' &&
      this.imageUrls.length == 0
    ) {
      return;
    } else {
      this.startUploading();
    }
  }

  startUploading() {
    this.IsUploading = true;
    this.uploadImage(0);
  }

  postTweet() {
    var postText: HTMLSpanElement = document.querySelector(
      '.dark-mode-1.light-text.reply-text-input'
    );
    var tweet: AddTweetDTO = {
      body: postText.innerText,
      images: this.imagesNames,
      video: this.videoName,
      creationDate: new Date(),
    };
    this._tweetService.addReply(this.TweetId, tweet).subscribe(
      (data) => {
        this.tweet.replyCount++;
        this._increaseReplyCountSharedService.TweetId = this.TweetId;
        this._increaseReplyCountSharedService.sendClickEvent();
        // this.tweetService.getReplies(this.tweet.id, this.pageSize, 1).subscribe(
        //   (res) => {
        //     // this.tweet = res;
        //     // this.TweetId = this.tweet.id;
        //     this.replies = res;
        //   },
        //   (err) => console.log(err)
        // );
        this.replies = [];
        this.getReplies(this.pageSize, 1);
      },
      (error) => {
        console.log(error);
      }
    );

    this.closePostTweetWindow();
  }

  uploadImage(index: number) {
    if (index == this.imageFiles.length) {
      this.IsUploading = false;
      this.uploadVideo(this.videoFile);
      return;
    }

    var image = this.imageFiles[index];
    const formDate = new FormData();
    formDate.append('file', image, image.name);
    this._tweetService.uploadTweetImage(formDate).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.UploadingProgress = Math.round(
            (100 * event.loaded) / event.total
          );
        } else if (event.type === HttpEventType.Response) {
          this.imagesNames.push({ imageName: event.body.fileName });
          this.uploadImage(++index);
        }
      },
      (error) => {
        alert('error');
      }
    );
  }

  uploadVideo(video: File) {
    if (video == null) {
      this.postTweet();
      return;
    }

    const formDate = new FormData();
    formDate.append('file', video, video.name);
    this.IsUploading = true;
    this._tweetService.uploadTweetVideo(formDate).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.UploadingProgress = Math.round(
            (100 * event.loaded) / event.total
          );
        } else if (event.type === HttpEventType.Response) {
          setTimeout(() => {
            this.IsUploading = false;
          }, 1000);

          this.videoName = {
            videoName: event.body.fileName,
          };
          this.postTweet();
        }
      },
      (error) => {
        alert('error');
      }
    );
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
    this.tweet.isLiked = !this.tweet.isLiked;
    this.tweet.likeCount = isLiked ? this.tweet.likeCount - 1 : this.tweet.likeCount + 1;
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
    this.tweet.isBookmarked = !this.tweet.isBookmarked;
    this.tweet.bookmarkCount = isBookmarked
      ? this.tweet.bookmarkCount - 1
      : this.tweet.bookmarkCount + 1;
  }

  
}
