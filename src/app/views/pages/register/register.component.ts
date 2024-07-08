import { Component, OnInit } from '@angular/core';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { CabangService } from 'src/app/services/cabang.service';
import { RegisterService } from 'src/app/services/register.service'
import { Register } from 'src/app/models/register'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  cabangList: string[] = [];
  registerData: Register = new Register();

  constructor(
    private cabangService: CabangService,
    private registerService: RegisterService
  ) { }

  ngOnInit(): void {
    this.loadCabang();
  }

  loadCabang(): void {
    this.cabangService.getCabangList().subscribe({
      next: (response: ArrayDataResponse) => {
        this.cabangList = response.data;
      },
      error: (error) => {
        console.error('Gagal memuat data cabang:', error);
      }
    });
  }

  onSubmit() {
    this.registerService.register(this.registerData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Registrasi Berhasil',
          text: 'SILAHKAN TUNGGU APPROVAL',
          confirmButtonText: 'OK'
        });
        // Reset form
        this.registerData = new Register();
      },
      error: (error) => {
        console.error('Registration failed', error);
        let errorMessage = 'Terjadi kesalahan saat registrasi';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        Swal.fire({
          icon: 'error',
          title: 'Registrasi Gagal',
          text: errorMessage,
          confirmButtonText: 'OK'
        });
      }
    });
  }
}

