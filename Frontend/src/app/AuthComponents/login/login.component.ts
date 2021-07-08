import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { TokenService } from '../../shared/services/token.service';
import { PatternValidation } from '../../shared/validations/patternMatcher';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private _authService: AuthenticationService, private tokenService: TokenService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    window.localStorage.setItem('darkmode','light');
  }


  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }


  loginForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, PatternValidation(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
  });

  isDarkModeEnabled = () => window.localStorage.getItem('darkmode') == 'dark';

  invalidEmailOrPassword: boolean = false;

  onSubmit() {
    this._authService.login(this.loginForm.value).subscribe(
      response => {
        this.tokenService.saveToken(response.body['token']);
        console.log(response.body['token'])
        this.tokenService.saveUser(response.body);
        console.log(response.body)
        this.invalidEmailOrPassword = false;
        this.router.navigate(['/home'])

      }
      , err => {
        this.invalidEmailOrPassword = true;
        console.log(err.error)
      })
  }

}
