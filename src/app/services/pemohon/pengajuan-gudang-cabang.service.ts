import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDetailPengajuanGudangCabang } from '../../interfaces/pemohon/i-detail-pengajuan-gudang-cabang';
import { GenericDataResponse } from 'src/app/interfaces/responses/generic-data-response';
import { IPengajuanGudangCabang } from 'src/app/interfaces/pemohon/i-pengajuan-gudang-cabang';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';

@Injectable({
  providedIn: 'root'
})
export class PengajuanGudangCabangService {

  baseUrl: string = environment.baseUrl;
  
  private apiUrl = '/api/pengajuan/cabang';

  constructor(private http: HttpClient) { }

  getDetailPengajuanByCabang(page: number, size: number): Observable<ListDataResponse<IPengajuanGudangCabang>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    let url = `${this.baseUrl}/${this.apiUrl}/detail-by-cabang`;
  
    return this.http.get<ListDataResponse<IPengajuanGudangCabang>>(url, { params });
  }

  getDetailPengajuanByUser(): Observable<GenericDataResponse<IPengajuanGudangCabang[]>> {
    return this.http.get<GenericDataResponse<IPengajuanGudangCabang[]>>(`${this.baseUrl}/${this.apiUrl}/detail-by-user`);
  }

  create(pengajuanRequest: IPengajuanGudangCabang): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/create`, pengajuanRequest);
  }

  approval(detailPengajuan: IDetailPengajuanGudangCabang, app: boolean): Observable<any> {
    let url = `${this.baseUrl}/${this.apiUrl}`;

    if(app) {
      url += `/approve`;
    } else{
      url += `/not-approve`;
    }
    
    return this.http.put(url, detailPengajuan).pipe(
      // catchError(this.handleError)
    );
  }

  diterima(detailPengajuan: IDetailPengajuanGudangCabang): Observable<any> {
    const url = `${this.baseUrl}/${this.apiUrl}/diterima`;
    return this.http.put(url, detailPengajuan);
  }


}
