import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IUnitGroup } from 'src/app/interfaces/admin/unit/i-unit-group';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { GenericDataResponse } from 'src/app/interfaces/responses/generic-data-response';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UnitGroupService {

  baseUrl: string = environment.baseUrl;
  private apiUrl = '/api/unit-group';

  constructor(private http: HttpClient) { }

  getGroupList(): Observable<ArrayDataResponse> {
    return this.http.get<ArrayDataResponse>(`${this.baseUrl}/${this.apiUrl}/list`).pipe(
      catchError(this.handleError)
    );
  }

  getAllGroup(searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}/${this.apiUrl}/all`, { params }).pipe(
      // catchError(this.handleError)
    );  
  }

  getGroupById(id: number): Observable<GenericDataResponse<IUnitGroup>> {
    const url = `${this.baseUrl}/${this.apiUrl}/data/${id}`;
    return this.http.get<GenericDataResponse<IUnitGroup>>(url);
  }

  editGroup(group: IUnitGroup): Observable<any> {
    const url = `${this.baseUrl}/${this.apiUrl}/edit/${group.idUnitGroup}`;
    return this.http.put(url, group);
  }

  deleteGroup(idUnitGroup: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.apiUrl}/delete/${idUnitGroup}`).pipe(
      // catchError(this.handleError)
    );
  }

  createGroup(unitGroupDTO: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/create`, unitGroupDTO);
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
