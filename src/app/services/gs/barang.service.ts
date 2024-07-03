import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IBarang } from 'src/app/interfaces/gs/i-barang';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { GenericDataResponse } from 'src/app/interfaces/responses/generic-data-response'
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';

@Injectable({
  providedIn: 'root'
})
export class BarangService {

  baseUrl: string = environment.baseUrl;
  
  private apiUrl = '/api/barang';

  constructor(private http: HttpClient) { }

  getBarangList(kategori: string, searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('kategori', kategori)
      .set('searchTerm', searchTerm)
      .set('page', page.toString())
      .set('size', size.toString());

    let url = `${this.baseUrl}/${this.apiUrl}/all`;

    return this.http.get<any>(url, { params }).pipe(
      // catchError(this.handleError)
    );
    
  }

  getNamaBarangList(kategori: string): Observable<ArrayDataResponse> {
    return this.http.get<ArrayDataResponse>(`${this.baseUrl}/${this.apiUrl}/list/${kategori}`).pipe(
      catchError(this.handleError)
    );
  }

  getBarangById(id: number): Observable<GenericDataResponse<IBarang>> {
    const url = `${this.baseUrl}/${this.apiUrl}/data/${id}`;
    return this.http.get<GenericDataResponse<IBarang>>(url);
  }

  getBarangByNama(nama: string): Observable<GenericDataResponse<IBarang>> {
    const url = `${this.baseUrl}/${this.apiUrl}/nama/${nama}`;
    return this.http.get<GenericDataResponse<IBarang>>(url);
  }

  editBarang(barang: IBarang): Observable<any> {
    const url = `${this.baseUrl}/${this.apiUrl}/edit/${barang.idBarang}`;
    return this.http.put(url, barang);
  }

  deleteBarang(idBarang: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.apiUrl}/delete/${idBarang}`).pipe(
      // catchError(this.handleError)
    );
  }

  createBarang(barangDTO: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/create`, barangDTO);
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
