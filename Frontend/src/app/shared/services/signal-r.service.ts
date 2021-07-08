import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { TweetDTO } from '../_interfaces/tweetDTO';
import { TweetSharedService } from './tweet-shared.service';


@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  public tweet: TweetDTO;
  public userName: string;

  private hubConnection: signalR.HubConnection;
  constructor(private _tweetSharedService: TweetSharedService) {}

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiUrl + "/tweethub")
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  };


  public broadcastData = (data , userName) => {
    this.hubConnection.invoke('BroadcastTweet', data, userName)
    .catch(err => console.error(err));
  }

  public addBroadcastDataListener = () => {
    this.hubConnection.on('BroadcastTweet', (data, userName) => {
      this.tweet = data;
      this.userName = userName;
      this._tweetSharedService.sendClickEvent();
    })
  }
}
