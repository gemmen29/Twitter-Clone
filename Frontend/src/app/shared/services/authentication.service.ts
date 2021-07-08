import { RegisterUserDto } from './../_interfaces/registerUserDTO.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ForgotPasswordDto } from '../_interfaces/forgotPasswordDTO.model';
import { ResetPasswordDto } from '../_interfaces/resetPasswordDTO.model';

const AUTH_API = `${environment.apiUrl}/api/Account/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) { }
  login(user: any) {
    const u = { email: user.email, password: user.password };
    return this.http.post(AUTH_API + 'login', u, { observe: 'response' });
  }

  signup(user: RegisterUserDto) {
    const u: any = {
      firstname: user.firstName,
      lastname: user.lastName,
      username: user.userName,
      email: user.email,
      password: user.password,
    };
    console.log(u);
    return this.http.post(`${environment.apiUrl}/api/Account/register`, u, {
      observe: 'response',
    });
  }
  public forgotPassword = (body: ForgotPasswordDto) => {
    return this.http.post(AUTH_API + 'ForgetPassword', body);
  };

  public resetPassword = (body: ResetPasswordDto) => {
    return this.http.post(AUTH_API + 'ResetPassword', body);
  };
}
