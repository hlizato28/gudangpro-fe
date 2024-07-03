import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { IUnitData } from 'src/app/interfaces/admin/unit/i-unit-data';
import { GenericDataResponse } from 'src/app/interfaces/responses/generic-data-response';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UnitDataService {

  baseUrl: string = environment.baseUrl;
  private apiUrl = '/api/unit';

  constructor(private http: HttpClient) { }

  getUnitList(isUnitGroup: boolean, group: string, searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('group', group)
      .set('searchTerm', searchTerm)
      .set('page', page.toString())
      .set('size', size.toString());

    let url = `${this.baseUrl}/${this.apiUrl}/all`;

    if(isUnitGroup) {
      url += `/with-group`;
    } else {
      url += `/no-group`;
    }    

    return this.http.get<any>(url, { params }).pipe(
      // catchError(this.handleError)
    );    
  }

  getUnitWithoutGroup(searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}/${this.apiUrl}/all/no-group`, { params }).pipe(
      // catchError(this.handleError)
    );    
  }

  deleteUnit(idUnit: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.apiUrl}/delete/${idUnit}`).pipe(
      // catchError(this.handleError)
    );
  }

  getUnitById(id: number): Observable<GenericDataResponse<IUnitData>> {
    const url = `${this.baseUrl}/${this.apiUrl}/data/${id}`;
    return this.http.get<GenericDataResponse<IUnitData>>(url);
  }

  editUnit(unit: IUnitData): Observable<any> {
    const url = `${this.baseUrl}/${this.apiUrl}/edit/${unit.idUnit}`;
    return this.http.put(url, unit);
  }

  assignGroup(unit: IUnitData): Observable<any> {
    const url = `${this.baseUrl}/${this.apiUrl}/assign-group/${unit.idUnit}`;
    return this.http.put(url, unit);
  }

  createUnit(unitDTO: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/create`, unitDTO);
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
