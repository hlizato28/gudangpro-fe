import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.development';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';

@Injectable({
  providedIn: 'root'
})
export class KategoriBarangService {

  baseUrl: string = environment.baseUrl;
  private apiUrl = '/api/katb';

  constructor(private http: HttpClient) { }

  getKategoriList(): Observable<ArrayDataResponse> {
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
