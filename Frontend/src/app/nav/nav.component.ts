import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AccountService } from '../shared/services/account.service';
import { FollowingService } from '../shared/services/following.service';
import { SharedService } from '../shared/services/shared.service';
import { TokenService } from '../shared/services/token.service';
import { DetailsUserDTO } from '../shared/_interfaces/detailsUserDTO.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  currentUser: DetailsUserDTO;
  
  constructor(
    private _router: Router,
    private _shared: SharedService,
    private _accountService: AccountService,
    private _followingService: FollowingService,
    private _tokenService: TokenService
    ) { }

  @HostListener('document:click', ['$event'])
  clickout(event) {    
    if(event.srcElement.classList.contains('sidebar-wrapper-display')) {
      this.Dismiss();
    }
  }

  ngOnInit(): void {
    // this.getFollowing()
    this.sidebar = document.querySelector('.sidebar');
    this.sidebarWrapper = document.querySelector('.sidebar-wrapper');
    this.circle = document.querySelector('.circle');
    this._accountService.getCurrentUser().subscribe(
      (data)=>{
        this.currentUser = data;
    });
    if(this.isDarkModeEnabled())
      this.circle.classList.toggle('move');
  }

  search(event) {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate(['/search'], {
      queryParams: { key: event.target.value },
    });
  }

  isDarkModeEnabled = () => window.localStorage.getItem('darkmode') == 'dark';
  
  // Sidebar

  sidebar: Element;
  sidebarWrapper: Element;

  Display() {
    this.sidebar.classList.add('sidebar-display');
    this.sidebarWrapper.classList.add('sidebar-wrapper-display');
  }

  Dismiss() {
    this.sidebar.classList.remove('sidebar-display');
    this.sidebarWrapper.classList.remove('sidebar-wrapper-display');
  }

  circle: Element;

  supportDarkMode() {
    this.circle.classList.toggle('move');
    if (window.localStorage.getItem('darkmode') == 'light')
      window.localStorage.setItem('darkmode', 'dark');
    else {
      window.localStorage.setItem('darkmode', 'light');
    }
    this._shared.sendClickEvent();
  }

  public createResourcesPath = (serverPath: string) => {
    return `${environment.apiUrl}/${serverPath}`;
  }

  logout() {
    this._tokenService.signOut();
    // this._router.navigate([''])
  }

  // getFollowing() {
  //   this._followingService.getFollowingByPage(10, 1).subscribe((res) => {
  //     this.followingUsers = res
  //   });
  // }

  // getFollowers() {
  //   this._followingService.getFollowersByPage(10, 1).subscribe((res) => {
  //     this.followerUsers = res
  //   });
  // }
}
