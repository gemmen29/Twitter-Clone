import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private _http: HttpClient, private _token: TokenService) { }

  joinChat(userTo: string) {
    const info = { token: this._token.getToken(), usernameTo: userTo };
    return this._http.post(environment.chatUrl, info, { observe: 'response' })
  }

}
