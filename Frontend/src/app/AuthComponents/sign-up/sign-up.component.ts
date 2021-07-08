import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordConfirmationValidatorService } from 'src/app/shared/validations/password-confirmation-validator.service';
import { RegisterUserDto } from 'src/app/shared/_interfaces/registerUserDTO.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { TokenService } from '../../shared/services/token.service';
import { PatternValidation } from '../../shared/validations/patternMatcher';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
// export class SignUpComponent implements OnInit {

//   constructor(private loginService: AuthenticationService, private fb: FormBuilder, private router: Router, private tokenService: TokenService) { }

//   ngOnInit(): void {
//   }

//   isDarkModeEnabled = () => window.localStorage.getItem('darkmode') == 'dark';

//   get firstname() {
//     return this.signupform.get('firstname');
//   }
//   get lastname() {
//     return this.signupform.get('lastname');
//   }
//   get username() {
//     return this.signupform.get('username');
//   }
//   get email() {
//     return this.signupform.get('email');
//   }
//   get password() {
//     return this.signupform.get('password');
//   }
//   get confirmPassword() {
//     return this.signupform.get('confirmPassword');
//   }


//   signupform = this.fb.group({
//     firstname: ['', [Validators.required, Validators.minLength(5)]],
//     lastname: ['', [Validators.required, Validators.minLength(5)]],
//     username: ['', [Validators.required, Validators.minLength(5)]],
//     password: ['', [Validators.required]],
//     email: ['', [Validators.required, PatternValidation(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
//   });


//   invalidEmailOrPassword: boolean = false;

// onSubmit() {
//   this.loginService.signup(this.signupform.value).subscribe(
//     response => {
//       this.tokenService.saveToken(response.body['token']);
//       console.log(response.body['token'])
//       this.tokenService.saveUser(response.body);
//       console.log(response.body)
//       this.invalidEmailOrPassword = false;
//       this.router.navigate(['/home'])

//     }
//     , err => {
//       this.invalidEmailOrPassword = true;
//     })
// }

// }

export class SignUpComponent implements OnInit {
  public registerForm: FormGroup;
  public errorMessage: string = '';
  public showError: boolean;

  constructor(private _authService: AuthenticationService, private _passConfValidator: PasswordConfirmationValidatorService,
    private _router: Router, private _tokenService: TokenService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });
    this.registerForm.get('confirm').setValidators([Validators.required,
    this._passConfValidator.validateConfirmPassword(this.registerForm.get('password'))]);
  }

  isDarkModeEnabled = () => window.localStorage.getItem('darkmode') == 'dark';

  public validateControl = (controlName: string) => {
    return this.registerForm.controls[controlName].invalid && this.registerForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName)
  }

  public registerUser = (registerFormValue) => {
    this.showError = false;
    const formValues = { ...registerFormValue };

    const user: RegisterUserDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      userName: formValues.userName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirm
    };
    console.log(user)
    this._authService.signup(user)
      .subscribe(response => {
        this._tokenService.saveToken(response.body['token']);
        console.log(response.body['token'])
        this._tokenService.saveUser(response.body);
        console.log(response.body)
        this._router.navigate(['/home'])
      },
        error => {
          this.errorMessage = error.error;
          this.showError = true;
        })
  }

}
