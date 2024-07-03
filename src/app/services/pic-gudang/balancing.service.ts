import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ListDataResponse } from './../../interfaces/responses/list-data-response';
import { IDetailBalancing } from './../../interfaces/pic-gudang/balancing/i-detail-balancing'
import { IBalancing } from 'src/app/interfaces/pic-gudang/balancing/i-balancing';
import { IReportBalancing } from 'src/app/interfaces/pic-gudang/balancing/i-report-balancing';
import { IReport } from 'src/app/interfaces/pic-gudang/balancing/i-report';

@Injectable({
  providedIn: 'root'
})
export class BalancingService {

  baseUrl: string = environment.baseUrl;
  
  private apiUrl = '/api/balancing';

  constructor(private http: HttpClient) { }

  getDetailBalancing(kategori: string, tanggal: string, page: number, size: number): Observable<ListDataResponse<IDetailBalancing>> {
    const params = new HttpParams()
      .set('kategori', kategori)
      .set('tanggal', tanggal)
      .set('page', page.toString())
      .set('size', size.toString());

    let url = `${this.baseUrl}/${this.apiUrl}/all`;

    return this.http.get<ListDataResponse<IDetailBalancing>>(url, { params }).pipe(
      // catchError(this.handleError)
    );
  }

  balancing(balancingDTO: IBalancing): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/balanced`, balancingDTO);
  }

  getReport(kategori: string, tanggal: string, app: boolean, rj: boolean, page: number, size: number): Observable<ListDataResponse<IReport>> {
    let params = new HttpParams()
      .set('kategori', kategori)
      .set('tanggal', tanggal)
      .set('page', page.toString())
      .set('size', size.toString());
  
    let url = `${this.baseUrl}/${this.apiUrl}/report`;
  
    if(!app && !rj) {
      url += `/no-approve`;
    } else if (app && !rj) {
      url += `/with-approve`;
    }
  
    return this.http.get<ListDataResponse<IReport>>(url, { params });
  }
  
  getAllReport(kategori: string, tanggal: string, app: boolean, rj: boolean): Observable<IReportBalancing[]> {
    let params = new HttpParams()
      .set('kategori', kategori)
      .set('tanggal', tanggal);
  
    let url = `${this.baseUrl}/${this.apiUrl}/report/all`;
  
    if(!app && !rj) {
      url += `/no-approve`;
    } else if (app && !rj) {
      url += `/with-approve`;
    }
  
    return this.http.get<IReportBalancing[]>(url, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching all reports:', error);
        return of([]); 
      })
    );
  }
  approveBalancing(reportBalancing: IReport, app: boolean): Observable<any> {
    let url = `${this.baseUrl}/${this.apiUrl}/to`;

    if(app) {
      url += `/approve`;
    } else{
      url += `/revisi`;
    }
    
    return this.http.put(url, reportBalancing);
  }

}
