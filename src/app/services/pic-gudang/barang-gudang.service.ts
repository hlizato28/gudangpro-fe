import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { IBarangGudang } from './../../interfaces/pic-gudang/i-barang-gudang';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { GenericDataResponse } from 'src/app/interfaces/responses/generic-data-response';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';

@Injectable({
  providedIn: 'root'
})
export class BarangGudangService {

  baseUrl: string = environment.baseUrl;
  
  private apiUrl = '/api/barang-gudang';

  constructor(private http: HttpClient) { }

  getBarangGudangList(ca: boolean, da: boolean, kategori:string, searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('kategori', kategori)
      .set('searchTerm', searchTerm)
      .set('page', page.toString())
      .set('size', size.toString());

    let url = `${this.baseUrl}/${this.apiUrl}`;

    if(ca && !da) {
      url += `/approved`;
    } else if (!ca && !da) {
      url += `/not-approved`;
    } else if (ca && da) {
      url += `/delete-tba`;
    }

    return this.http.get<ListDataResponse<IBarangGudang>>(url, { params }).pipe(
      // catchError(this.handleError)
    );
    
  }

  getNamaBarangGudangList(kategori: string): Observable<ArrayDataResponse> {
    const params = new HttpParams()
      .set('kategori', kategori)

    return this.http.get<ArrayDataResponse>(`${this.baseUrl}/${this.apiUrl}/list-by-kategori`, { params }).pipe(
      // catchError(this.handleError)
    );
  }

  createBarangGudang(barangGudang: IBarangGudang): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/create`, barangGudang);
  }

  approveCreate(id: number, app: boolean): Observable<any> {
    let url = `${this.baseUrl}/${this.apiUrl}/${id}`;

    if(app) {
      url += `/approve-create`;
    } else{
      url += `/not-approve-create`;
    }
    
    return this.http.put(url, {}).pipe(
      // catchError(this.handleError)
    );
  }

  deleteBarangGudang(idBarangGudang: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.apiUrl}/delete/${idBarangGudang}`).pipe(
      // catchError(this.handleError)
    );
  }

  approveDelete(id: number, app: boolean): Observable<any> {
    let url = `${this.baseUrl}/${this.apiUrl}/${id}`;

    if(app) {
      url += `/approve-delete`;
    } else{
      url += `/not-approve-delete`;
    }
    
    return this.http.put(url, {}).pipe(
      // catchError(this.handleError)
    );
  }
}
