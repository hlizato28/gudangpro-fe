import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDetailPengajuanGudangCabang } from '../../interfaces/pemohon/i-detail-pengajuan-gudang-cabang';
import { IPengajuanGudangCabang } from 'src/app/interfaces/pemohon/i-pengajuan-gudang-cabang';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PengajuanGudangCabangService {

  baseUrl: string = environment.baseUrl;
  
  private apiUrl = '/api/pengajuan/cabang';

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  getDetailPengajuanByCabang(page: number, size: number): Observable<ListDataResponse<IPengajuanGudangCabang>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    let url = `${this.baseUrl}/${this.apiUrl}/detail-by-cabang`;
  
    return this.http.get<ListDataResponse<IPengajuanGudangCabang>>(url, { params });
  }

  getDetailPengajuanByCabangKP(page: number, size: number): Observable<ListDataResponse<IPengajuanGudangCabang>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    let url = `${this.baseUrl}/${this.apiUrl}/detail-by-cabang/kp`;
  
    return this.http.get<ListDataResponse<IPengajuanGudangCabang>>(url, { params });
  }

  getDetailPengajuanByUser(page: number, size: number): Observable<ListDataResponse<IDetailPengajuanGudangCabang>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    let url = `${this.baseUrl}/${this.apiUrl}/detail-by-user`;

    return this.http.get<ListDataResponse<IDetailPengajuanGudangCabang>>(url, { params });
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

  approvalUH(id: number): Observable<any> {
    let url = `${this.baseUrl}/${this.apiUrl}/approve-uh/${id}`;
    
    return this.http.put(url, {}).pipe(
      // catchError(this.handleError)
    );
  }

  diterima(detailPengajuan: IDetailPengajuanGudangCabang): Observable<any> {
    const url = `${this.baseUrl}/${this.apiUrl}/diterima`;
    return this.http.put(url, detailPengajuan);
  }

  getRevisiOut(idDetailBalancing: number, createdAt: number, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('tgl', createdAt)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(`${this.baseUrl}/${this.apiUrl}/revisi-out/${idDetailBalancing}`, { params });
  }

  revisiDetailPengajuan(id: number, pengajuanList: IPengajuanGudangCabang[]): Observable<any> {
    const url = `${this.baseUrl}/${this.apiUrl}/revisi-out/save/${id}`;
    return this.http.put(url, pengajuanList);
  }



}
