import { Component, OnInit } from '@angular/core';
import { FollowingService } from '../shared/services/following.service';
import { DetailsUserDTO } from '../shared/_interfaces/detailsUserDTO.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {

  suggestedUsers:DetailsUserDTO[]
  constructor(private _followingService:FollowingService) { }

  ngOnInit(): void {
    this._followingService.getSuggestedFollowings().subscribe(
      data=>{
        this.suggestedUsers = data;
      },
      error=>{
        console.log(error);
      }
    )
  }

  public createResourcesPath = (serverPath: string) => {
    return `${environment.apiUrl}/${serverPath}`;
  }

  follow(userId: string) {
    this._followingService.follow(userId).subscribe(
      (data) => {},
      (error) => {
        //  this.errorMsg = error;
      }
    );
    this.updateIsFollowedValue(userId);
  }
  
  isDarkModeEnabled = () => window.localStorage.getItem('darkmode') == 'dark';

  unfollow(userId: string) {
    this._followingService.unfollow(userId).subscribe(
      (data) => {},
      (error) => {
        //  this.errorMsg = error;
      }
    );
    this.updateIsFollowedValue(userId);
  }

  private updateIsFollowedValue(userId: string) {
    this.suggestedUsers.forEach((user) => {
      if(user.id == userId) {
        user.isFollowedByCurrentUser = !user.isFollowedByCurrentUser;
      }
    })
  }

}
