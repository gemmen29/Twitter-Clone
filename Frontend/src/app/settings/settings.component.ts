import { TweetService } from 'src/app/shared/services/tweet.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AccountService } from '../shared/services/account.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { PatternValidation } from '../shared/validations/patternMatcher';
import { UpdateUserDTO } from '../shared/_interfaces/updateUserDTO.model';
import { HttpEventType } from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settingForm: FormGroup;
  invalidEmailOrPassword: boolean = false;
  image: string;
  profilePic: File;
  newImagePath:any = '';

  constructor(
    private _authService: AuthenticationService,
    private fb: FormBuilder,
    private router: Router,
    private _accountService: AccountService,
    private _tweetService: TweetService,
    private sanitizer:DomSanitizer,
  ) { }

  ngOnInit(): void {

    this.settingForm = this.fb.group({
      username: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],

    });

    this._accountService.getCurrentUser().pipe(first()).subscribe(
      (data) => {
        this.settingForm.setValue({
          username: data.userName,
          email: data.email,
          firstname: data.firstName,
          lastname: data.lastName,
        });
        this.image = data.userPic;
      },
      (error) => {
        // this.error = error;
        // this.loading = false;
      }
    );
  }

  get firstname() {
    return this.settingForm.get('firstname');
  }
  get lastname() {
    return this.settingForm.get('lastname');
  }
  get username() {
    return this.settingForm.get('username');
  }
  get email() {
    return this.settingForm.get('email');
  }

  onSubmit() {
    this.uploadImage();
  }

  updateData() {
    let updateUserDTO: UpdateUserDTO = {
      firstName: this.firstname.value,
      lastName: this.lastname.value,
      email: this.email.value,
      image: this.image
    };
    console.log(updateUserDTO);
    this._accountService
      .updateUser(updateUserDTO)
      .subscribe(
        (response) => {
          this.invalidEmailOrPassword = false;
          // this.router.navigate(['/home']);
        },
        (err) => {
          this.invalidEmailOrPassword = true;
        }
      );
  }

  isDarkModeEnabled = () => window.localStorage.getItem('darkmode') == 'dark';

  public createResourcesPath = (serverPath: string) => {
    return `${environment.apiUrl}/${serverPath}`;
  }

  changePhoto(event) {
    let files = event.target.files;
    this.profilePic = files[0];

    var reader = new FileReader();
    reader.readAsDataURL(this.profilePic); 
    reader.onload = (_event) => { 
      this.newImagePath = reader.result; 
    }
  }

  uploadImage() {
    if (this.profilePic !== null && this.profilePic !== undefined) {
      const formDate = new FormData();
      formDate.append("file", this.profilePic, this.profilePic.name);
      this._tweetService.uploadTweetImage(formDate).subscribe(event => {
        if (event.type === HttpEventType.Response) {
          this.image = event.body.fileName;
          this.updateData();
        }
      })
    } else {
      this.updateData();
    }
  }


}
