import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { SignUpComponent } from './AuthComponents/sign-up/sign-up.component';
import { LoginComponent } from './AuthComponents/login/login.component';
import { ResetPasswordComponent } from './AuthComponents/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './AuthComponents/forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { SettingsComponent } from './settings/settings.component';
import { TweetComponent } from './TweetComponents/tweet/tweet.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { authInterceptorProviders } from './shared/_helpers/auth.interceptor';
import { TweetDetailsComponent } from './TweetComponents/tweet-details/tweet-details.component';
import { PostTweetComponent } from './TweetComponents/post-tweet/post-tweet.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NavComponent } from './nav/nav.component';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { TweetRepliesComponent } from './TweetComponents/tweet-replies/tweet-replies.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    SignUpComponent,
    LoginComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    HomeComponent,
    FooterComponent,
    SettingsComponent,
    TweetComponent,
    SearchResultComponent,
    PostTweetComponent,
    UserProfileComponent,
    TweetDetailsComponent,
    NavComponent,
    SidePanelComponent,
    TweetRepliesComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
