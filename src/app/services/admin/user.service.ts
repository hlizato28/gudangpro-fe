import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from './../../../environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { GenericDataResponse } from './../../interfaces/responses/generic-data-response';
import { IUser } from './../../interfaces/admin/user/i-user';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserService{

  baseUrl: string = environment.baseUrl;
  private apiUrl = '/api/u';
  private apiUrlAuth = '/api/auth';

  constructor(private http: HttpClient) { }

  getUserList(role: string, isApproved: boolean, searchTerm: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('role', role)
      .set('searchTerm', searchTerm)
      .set('page', page.toString())
      .set('size', size.toString());

    let url = `${this.baseUrl}/${this.apiUrl}/user`;

    if(isApproved) {
      url += `/approved`;
    } else {
      url += `/not-approved`;
    }    

    return this.http.get<any>(url, { params }).pipe(
      // catchError(this.handleError)
    );
  }

  deleteUser(idUser: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.apiUrl}/delete/${idUser}`).pipe(
      // catchError(this.handleError)
    );
  }

  getUserById(id: number): Observable<GenericDataResponse<IUser>> {
    const url = `${this.baseUrl}/${this.apiUrl}/data/${id}`;
    return this.http.get<GenericDataResponse<IUser>>(url);
  }

  getCurrentUser(): Observable<GenericDataResponse<IUser>> {
    const url = `${this.baseUrl}/${this.apiUrl}/current-user`;
    return this.http.get<GenericDataResponse<IUser>>(url);
  }

  editUser(user: IUser): Observable<any> {
    const url = `${this.baseUrl}/${this.apiUrl}/edit/${user.idUser}`;
    return this.http.put(url, user);
  }

  approve(user: IUser): Observable<any> {
    const url = `${this.baseUrl}/${this.apiUrlAuth}/registration/approve/${user.idUser}`;
    return this.http.put(url, user);
  }

  createUser(userDTO: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/create`, userDTO);
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
