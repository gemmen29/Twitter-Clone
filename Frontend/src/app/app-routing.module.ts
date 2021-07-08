import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './AuthComponents/forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './AuthComponents/login/login.component';
import { ResetPasswordComponent } from './AuthComponents/reset-password/reset-password.component';
import { SignUpComponent } from './AuthComponents/sign-up/sign-up.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SettingsComponent } from './settings/settings.component';
import { StartComponent } from './start/start.component';
import { TweetDetailsComponent } from './TweetComponents/tweet-details/tweet-details.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from './shared/_helpers/auth.guard';

const routes: Routes = [
  { path: 'forgotpassword', component: ForgotPasswordComponent},
  { path: 'resetpassword', component: ResetPasswordComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'tweet/:id', component: TweetDetailsComponent, canActivate: [AuthGuard] },
  { path: 'profile/:username', component: UserProfileComponent, canActivate: [AuthGuard] },
  //{ path: '', component: StartComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard],},
  { path: 'setting', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchResultComponent, canActivate: [AuthGuard] },
  { path: '**', component: StartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
