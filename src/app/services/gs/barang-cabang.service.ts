import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { GenericDataResponse } from '../../interfaces/responses/generic-data-response';
import { IBarangCabang } from '../../interfaces/gs/i-barang-cabang';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';

@Injectable({
  providedIn: 'root'
})
export class BarangCabangService {

  baseUrl: string = environment.baseUrl;
  
  private apiUrl = '/api/barcb';

  constructor(private http: HttpClient) { }

  getBarangCabangList(cabang: string, kategori:string, searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('kategori', kategori)
      .set('searchTerm', searchTerm)
      .set('page', page.toString())
      .set('size', size.toString());

    let url = `${this.baseUrl}/${this.apiUrl}/cab=${cabang}`;

    return this.http.get<any>(url, { params }).pipe(
      // catchError(this.handleError)
    );
    
  }

  getNamaBarangCabangList(kategori: string): Observable<ArrayDataResponse> {
    const params = new HttpParams()
      .set('kategori', kategori)

    return this.http.get<ArrayDataResponse>(`${this.baseUrl}/${this.apiUrl}/list-by-kategori`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getBarangCabangById(id: number): Observable<GenericDataResponse<IBarangCabang>> {
    const url = `${this.baseUrl}/${this.apiUrl}/data/${id}`;
    return this.http.get<GenericDataResponse<IBarangCabang>>(url);
  }

  editBarangCabang(barangCabang: IBarangCabang): Observable<any> {
    const url = `${this.baseUrl}/${this.apiUrl}/edit/${barangCabang.idBarangCabang}`;
    return this.http.put(url, barangCabang);
  }

  deleteBarangCabang(idBarangCabang: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.apiUrl}/delete/${idBarangCabang}`).pipe(
      // catchError(this.handleError)
    );
  }

  createBarangCabang(barangCabangDTO: IBarangCabang): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/create`, barangCabangDTO);
  }

  createBarangAllCabang(barang: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/create/all-cabang`, { namaBarang: barang });
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
