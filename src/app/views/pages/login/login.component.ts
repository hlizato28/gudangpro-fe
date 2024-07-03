import { Component } from '@angular/core';
import { ILogin } from 'src/app/interfaces/i-login';
import { IError } from 'src/app/interfaces/i-error';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  user: ILogin;
  error: IError;
  

  constructor(private loginService: LoginService, private router: Router) {
    this.user = {
      username: "",
      password: ""
    }

    this.error = {
      message: ""
    }
   }


  onLogin(): void {
    this.loginService.login(this.user)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Login failed:', error);
        Swal.fire({
          title: 'Error!',
          text: error.error.message,
          icon: 'error',
        });
        return throwError(new Error("Something went wrong"));
      }))
    .subscribe((response: any) => {
      console.log("Login response received:", response);
        this.loginService.setAuthentication(response.data);
        Swal.fire({
          title: 'Success!',
          text: 'Berhasil Login',
          icon: 'success',
        }).then(() => {
          this.router.navigate(['/dashboard']);
        })
      })
  }

}
