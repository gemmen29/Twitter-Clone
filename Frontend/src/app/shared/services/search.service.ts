import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { DetailsUserDTO } from '../_interfaces/detailsUserDTO.model';
import { SearchDTO } from '../_interfaces/searchDTO.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private _http: HttpClient) {}

  getUsersCount(keyword:string): Observable<number> {
    let url = `${environment.apiUrl}/api/Search/count/${keyword}`;
    return this._http.get<number>(url).pipe(
      catchError((err) => {
        return throwError(
          err.message || 'Internal Server error contact site adminstarator'
        );
      })
    );
  }
  
  getUsersByPage(searchDto: SearchDTO): Observable<DetailsUserDTO[]> {
    let url = `${environment.apiUrl}/api/Search/search`;
    return this._http.post<DetailsUserDTO[]>(url, searchDto).pipe(
      catchError((err) => {
        return throwError(
          err.message || 'Internal Server error contact site adminstarator'
        );
      })
    );
  }
}
