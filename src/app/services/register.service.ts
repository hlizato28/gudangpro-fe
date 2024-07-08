import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment.development';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Register } from '../models/register';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  baseUrl: string = environment.baseUrl; // Misalnya 'http://localhost:8080/api'

  constructor(private http: HttpClient) { }

  register(registerData: Register): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/registration`, registerData);
  }
}
