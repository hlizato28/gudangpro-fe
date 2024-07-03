import { Component, OnInit } from '@angular/core';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { BarangCabang } from 'src/app/models/gs/barang-cabang';
import { BarangService } from 'src/app/services/gs/barang.service';
import { KategoriBarangService } from 'src/app/services/gs/kategori-barang.service';
import { BarangCabangService } from 'src/app/services/gs/barang-cabang.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-semua',
  templateUrl: './semua.component.html',
  styleUrls: ['./semua.component.scss']
})
export class SemuaComponent implements OnInit{
  kategoriList: string[] = [];
  namaBarangList: string[] = [];
  newBarangCabang: BarangCabang = new BarangCabang();
  selectedKategori: string = '';

  constructor(
    private kategoriBarangService: KategoriBarangService,
    private barangCabangService: BarangCabangService,
    private barangService: BarangService) { }

  ngOnInit(): void {
      this.loadKategori();
  }

  loadKategori(): void {
    this.kategoriBarangService.getKategoriList().subscribe({
      next: (response: ArrayDataResponse) => {
        this.kategoriList = response.data;
      },
      error: (error) => {
        console.error('Gagal memuat data kategori:', error);
      }
    });
  }

  loadNamaBarangList(): void {
    if (this.selectedKategori) {
      this.barangService.getNamaBarangList(this.selectedKategori).subscribe({
        next: (response: ArrayDataResponse) => {
          this.namaBarangList = response.data;
        },
        error: (error) => {
          console.error('Gagal memuat data nama barang:', error);
          Swal.fire({
            title: 'Error',
            text: 'Gagal memuat data nama barang.',
            icon: 'error',
          });
        }
      });
    }
  }

  onKategoriChange(): void {
    this.loadNamaBarangList();
    this.newBarangCabang.namaBarang = '';
  }

  onSubmitAdd(): void {
    Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin menyimpan barang "${this.newBarangCabang.namaBarang}" ini ke semua cabang?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Simpan',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        this.barangCabangService.createBarangAllCabang(this.newBarangCabang.namaBarang).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Sukses',
              text: 'Barang berhasil ditambahkan di semua cabang.',
              icon: 'success'
            }).then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            console.error('Gagal menambahkan barang:', error);
            Swal.fire({
              title: 'Error',
              text: error.error.message,
              icon: 'error'
            });
          }
        });
      }
    });
  }
}