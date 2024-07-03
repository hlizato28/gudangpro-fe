import { Component, OnInit } from '@angular/core';
import { IDetailPengajuanGudangCabang } from 'src/app/interfaces/pemohon/i-detail-pengajuan-gudang-cabang';
import { IPengajuanGudangCabang } from 'src/app/interfaces/pemohon/i-pengajuan-gudang-cabang';
import { PengajuanGudangCabangService } from 'src/app/services/pemohon/pengajuan-gudang-cabang.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approval-barang',
  templateUrl: './approval-barang.component.html',
  styleUrls: ['./approval-barang.component.scss']
})
export class ApprovalBarangComponent implements OnInit{
  pengajuan: IPengajuanGudangCabang[] = [];
  details: IDetailPengajuanGudangCabang[] = [];

  // Properti paginasi
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];

  constructor(
    private pengajuanService: PengajuanGudangCabangService
  ) { }

  ngOnInit(): void {
    this.loadDetailPengajuan();
  }

  loadDetailPengajuan(): void {
    this.pengajuanService.getDetailPengajuanByUser().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.pengajuan = response.data;
          this.details = this.pengajuan.flatMap(p => p.details);
          this.updatePagination();
        } else {
          console.error('Invalid response format');
          this.pengajuan = [];
          this.details = [];
        }
      },
      error: (error) => {
        console.error('Error loading detail:', error);
        this.pengajuan = [];
        this.details = [];
      }
    });
  }

  isValidApproval(detail: IDetailPengajuanGudangCabang): boolean {
    if (detail.jumlahDiterima === null || detail.jumlahDiterima === undefined) {
      Swal.fire({
        title: 'Error',
        text: 'Jumlah yang diterima tidak boleh kosong.',
        icon: 'error',
      });
      return false;
    }
    return true;
  }

  diterima(detail: IDetailPengajuanGudangCabang) {
    if (!this.isValidApproval(detail)) {
      return;
    }

    if (detail.idDetailPengajuanGudangCabang !== undefined) {
      this.pengajuanService.diterima(detail).subscribe({
        next: (response) => {
          console.log('Approval response:', response);
          this.loadDetailPengajuan();
          Swal.fire({
            title: 'Sukses',
            text: 'Item telah diterima!',
            icon: 'success',
          });
        },
        error: (error) => {
          console.error('Create approval error:', error);
          Swal.fire({
            title: 'Error',
            text: 'Terjadi kesalahan saat menerima item.',
            icon: 'error',
          });
        }
      });
    } else {
      console.error('ID Detail Pengajuan Gudang Cabang tidak ditemukan');
    }
  }

  // Metode paginasi
  updatePagination(): void {
    this.totalItems = this.details.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.updateVisiblePages();
  }

  updateVisiblePages(): void {
    const maxVisiblePages = 3;
    let startPage = Math.max(1, this.currentPage - 1);
    let endPage = Math.min(this.currentPage + 1, this.totalPages);

    if (this.totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = this.totalPages;
    } else {
      if (this.currentPage <= 2) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (this.currentPage >= this.totalPages - 1) {
        startPage = this.totalPages - maxVisiblePages + 1;
        endPage = this.totalPages;
      }
    }

    this.visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
  }

  get pagedDetails(): IDetailPengajuanGudangCabang[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.details.slice(startIndex, startIndex + this.pageSize);
  }

}


