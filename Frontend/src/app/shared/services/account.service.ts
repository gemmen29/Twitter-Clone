import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpdateUserDTO } from '../_interfaces/updateUserDTO.model';
import { catchError } from 'rxjs/operators';
import { DetailsUserDTO } from '../_interfaces/detailsUserDTO.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private _http: HttpClient) { }

  updateUser(
    userToUpdate: UpdateUserDTO
  ): Observable<UpdateUserDTO> {
    let url = `${environment.apiUrl}/api/Account/update`;
    return this._http.put<UpdateUserDTO>(url, userToUpdate).pipe(
      catchError((err) => {
        return throwError(
          err.message || 'Internal Server error contact site adminstarator'
        );
      })
    );
  }

  getCurrentUser(): Observable<DetailsUserDTO> {
    let url = `${environment.apiUrl}/api/Account/details`;
    return this._http.get<DetailsUserDTO>(url).pipe(
      catchError((err) => {
        return throwError(
          err.message || 'Internal Server error contact site adminstarator'
        );
      })
    );
  }

  getUserByUsername(username: string): Observable<DetailsUserDTO> {
    let url = `${environment.apiUrl}/api/Account/details/${username}`;
    return this._http.get<DetailsUserDTO>(url).pipe(
      catchError((err) => {
        return throwError(
          err.message || 'Internal Server error contact site adminstarator'
        );
      })
    );
  }
}
