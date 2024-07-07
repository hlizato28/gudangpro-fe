import { Component, OnInit } from '@angular/core';
import { IDetailPengajuanGudangCabang } from 'src/app/interfaces/pemohon/i-detail-pengajuan-gudang-cabang';
import { IPengajuanGudangCabang } from 'src/app/interfaces/pemohon/i-pengajuan-gudang-cabang';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { PengajuanGudangCabangService } from 'src/app/services/pemohon/pengajuan-gudang-cabang.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approval-barang',
  templateUrl: './approval-barang.component.html',
  styleUrls: ['./approval-barang.component.scss']
})
export class ApprovalBarangComponent implements OnInit{
  details: IDetailPengajuanGudangCabang[] = [];

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
    this.pengajuanService.getDetailPengajuanByUser(this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IDetailPengajuanGudangCabang>) => {
        if (Array.isArray(response.content)) {
          this.details = response.content;
        } else {
          console.error('Invalid response format: content is not an array');
          this.details = [];
        }
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number + 1;
        this.updateVisiblePages();
      },
      error: (error) => {
        console.error('Error loading detail:', error);
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
    this.loadDetailPengajuan();
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

    this.visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

}


