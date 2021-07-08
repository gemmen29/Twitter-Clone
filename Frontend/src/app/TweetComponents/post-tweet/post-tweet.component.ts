import { AddTweetDTO } from './../../shared/_interfaces/addTweetDTO';
import { AddRetweetDTO } from './../../shared/_interfaces/addRetweetDTO';
import { RetweetService } from './../../shared/services/retweet.service';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import * as moment from 'moment';
import { AccountService } from 'src/app/shared/services/account.service';
import { DetailsUserDTO } from 'src/app/shared/_interfaces/detailsUserDTO.model';
import { environment } from 'src/environments/environment';
import { TweetService } from '../../shared/services/tweet.service';
import { ImageDTO } from '../../shared/_interfaces/imageDTO';
import { VideoDTO } from '../../shared/_interfaces/videoDTO';
import { DeleteTweetSharedService } from 'src/app/shared/services/delete-tweet-shared.service';
import { IncreaseReplyCountServiceService } from 'src/app/shared/services/increase-reply-count-service.service';

@Component({
  selector: 'app-post-tweet',
  templateUrl: './post-tweet.component.html',
  styleUrls: ['./post-tweet.component.css'],
})
export class PostTweetComponent implements OnInit {
  modal: HTMLElement;
  modalInput: HTMLInputElement;

  imagesNames: ImageDTO[] = [];
  imageUrls = new Array<string>();
  imageFiles: File[] = [];

  videoName: VideoDTO;
  videoUrls = new String();
  videoFile: File = null;

  TweetId: number;
  action: string;

  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onPost: EventEmitter<any> = new EventEmitter();
  @Output() onRetweet: EventEmitter<any> = new EventEmitter();
  @Output() onReply: EventEmitter<any> = new EventEmitter();

  constructor(private _tweetService: TweetService, 
    private _accountService: AccountService,
    private _retweetService: RetweetService,
    private _deleteTweetSharedService: DeleteTweetSharedService,
    private _increaseReplyCountSharedService: IncreaseReplyCountServiceService) { }

  progressBarWidth: string = "";
  IsUploading = false;
  UploadingProgress = 0;
  currentUser: DetailsUserDTO;

  ngOnInit(): void {
    this.modal = document.querySelector('.modal.dark-mode-1');
    this.modalInput = document.querySelector('.modal-input');
    this._accountService.getCurrentUser().subscribe(
      (data) => {
        this.currentUser = data;
      });
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (event.srcElement.classList.contains('modal-wrapper-display')) {
      this.closePostTweetWindow();
    }
  }

  isDarkModeEnabled = () => window.localStorage.getItem('darkmode') == 'dark';

  openPostTweetWindow() {
    console.log(this.modal);
    this.modal.style.display = 'block';
  }

  closePostTweetWindow() {
    this.modal.style.display = 'none';
    this.onClose.emit();

    if (this.modalInput.value !== '') {
      this.modalInput.value = '';
    }

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
        }
        reader.onprogress = (e) => {
          this.UploadingProgress = Math.round((e.loaded * 100) / e.total);
        }
        reader.onloadend = (e) => {
          setTimeout(() => {
            this.IsUploading = false;
            this.imageFiles.push(file);
          }, 1000);
        }

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
        }
        reader.onprogress = (e) => {
          this.UploadingProgress = Math.round((e.loaded * 100) / e.total);
        }
        reader.onloadend = (e) => {
          setTimeout(() => {
            this.IsUploading = false;
            this.videoFile = file;
            console.log(this.videoFile);
          }, 3000);
        }

        reader.readAsDataURL(file);
      }
    }
  }

  deletImageFromTweet(event) {
    this.imageUrls.splice(this.imageUrls.indexOf(event.target.parentElement.previousSibling.getAttribute("src")), 1);
    this.imageFiles.splice(event.target.parentElement.previousSibling.getAttribute("data-index"));
  }

  deletVideoFromTweet() {
    this.videoUrls = '';
    this.videoFile = null;
    var videoList = document.querySelector('.video-list');
    videoList.firstChild.remove();
  }

  checkBeforeUploading() {
    var postText: HTMLTextAreaElement = document.querySelector(".tweet-text");
    if (postText.value == '' && this.videoUrls == "" && this.imageUrls.length == 0) {
      return;
    }
    else {
      this.startUploading();
    }
  }

  startUploading() {
    this.IsUploading = true;
    this.uploadImage(0);
  }

  postTweet() {
    var postText: HTMLTextAreaElement = document.querySelector(".tweet-text");
    var tweet: AddTweetDTO = {
      body: postText.value,
      images: this.imagesNames,
      video: this.videoName,
      creationDate: new Date()
    };

    if (this.action == undefined) {
      this._tweetService.addTweet(tweet).subscribe(
        (data) => {
          this.onPost.emit(data);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      if (this.action == 'reply') {
        this._tweetService.addReply(this.TweetId, tweet).subscribe(
          (data) => {
            this._increaseReplyCountSharedService.TweetId = this.TweetId;
            this._increaseReplyCountSharedService.sendClickEvent();
            //this.onReply.emit();
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        let obj: AddRetweetDTO = { reTweetId: this.TweetId, qouteTweet: tweet }
        this._retweetService.addRetweet(obj).subscribe(
          (data) => {
            //this._deleteTweetSharedService.sendClickEvent();
            //this.onRetweet.emit();
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }

    this.closePostTweetWindow();
  }

  uploadImage(index: number) {
    if (index == this.imageFiles.length) {
      this.IsUploading = false;
      this.uploadVideo(this.videoFile);
      return;
    }

    var image = this.imageFiles[index]
    const formDate = new FormData();
    formDate.append('file', image, image.name);
    this._tweetService.uploadTweetImage(formDate).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.UploadingProgress = Math.round(100 * event.loaded / event.total);
        }
        else if (event.type === HttpEventType.Response) {

          this.imagesNames.push({ imageName: event.body.fileName });
          this.uploadImage(++index);
        }
      },
      error => {
        alert("error");
      }
    );
  }

  uploadVideo(video: File) {
    if (video == null) {
      this.postTweet();
      return;
    }

    const formDate = new FormData();
    formDate.append("file", video, video.name);
    this.IsUploading = true;
    this._tweetService.uploadTweetVideo(formDate).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.UploadingProgress = Math.round(100 * event.loaded / event.total);
        }
        else if (event.type === HttpEventType.Response) {
          setTimeout(() => {
            this.IsUploading = false;
          }, 1000);

          this.videoName = {
            videoName: event.body.fileName
          }
          this.postTweet();
        }
      },
      error => {
        alert("error");
      }
    );
  }

  public createResourcesPath = (serverPath: string) => {
    return `${environment.apiUrl}/${serverPath}`;
  }
}
