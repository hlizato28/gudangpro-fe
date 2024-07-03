import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ArrayDataResponse } from './../interfaces/responses/array-data-response';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CabangService {

  baseUrl: string = environment.baseUrl;
  private apiUrl = '/api/cabang';

  constructor(private http: HttpClient) { }

  getCabangList(): Observable<ArrayDataResponse> {
    return this.http.get<ArrayDataResponse>(`${this.baseUrl}/${this.apiUrl}/list`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Terjadi kesalahan:', error);
    Swal.fire({
      title: 'Error!',
      text: error.error.message,
      icon: 'error',
    });
    return throwError(new Error("Something went wrong"));
  }
}
