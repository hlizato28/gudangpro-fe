import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDetailPengajuanGudangCabang } from 'src/app/interfaces/pemohon/i-detail-pengajuan-gudang-cabang';
import { IPengajuanGudangCabang } from 'src/app/interfaces/pemohon/i-pengajuan-gudang-cabang';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { PengajuanGudangCabangService } from 'src/app/services/pemohon/pengajuan-gudang-cabang.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-approval',
  templateUrl: './detail-approval.component.html',
  styleUrls: ['./detail-approval.component.scss']
})
export class DetailApprovalComponent implements OnInit {
  pengajuan: IPengajuanGudangCabang | null = null;
  allDetails: IDetailPengajuanGudangCabang[] = [];
  pagedDetails: IDetailPengajuanGudangCabang[] = [];

  // Properti paginasi
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];

  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pengajuanService: PengajuanGudangCabangService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.loadDetailPengajuan(this.id);
    }
  }

  loadDetailPengajuan(id: number): void {
    this.pengajuanService.getDetailPengajuanByCabang(this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IPengajuanGudangCabang>) => {
        const foundPengajuan = response.content.find(p => p.idPengajuanGudangCabang === id);
        if (foundPengajuan) {
          this.pengajuan = foundPengajuan;
          this.allDetails = foundPengajuan.details;
          this.totalItems = this.allDetails.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.updateVisiblePages();
          this.updatePagedDetails();
        } else {
          console.error('Pengajuan tidak ditemukan');
          Swal.fire('Error', 'Pengajuan tidak ditemukan', 'error');
        }
      },
      error: (error) => {
        console.error('Error loading detail:', error);
        Swal.fire('Error', 'Gagal memuat detail pengajuan', 'error');
      }
    });
  }

  updatePagedDetails(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedDetails = this.allDetails.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
    this.updatePagedDetails();
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

  isValidApproval(detail: IDetailPengajuanGudangCabang): boolean {
    if (detail.jumlahApproved === null || detail.jumlahApproved === undefined) {
      Swal.fire({
        title: 'Error',
        text: 'Jumlah yang disetujui tidak boleh kosong.',
        icon: 'error',
      });
      return false;
    }

    if (detail.jumlahApproved > detail.jumlahDiminta) {
      Swal.fire({
        title: 'Error',
        text: 'Jumlah yang disetujui tidak boleh melebihi jumlah yang diminta.',
        icon: 'error',
      });
      return false;
    }

    return true;
  }

  approval(detail: IDetailPengajuanGudangCabang, app: boolean) {
    if (!this.isValidApproval(detail)) {
      return;
    }

    if (detail.idDetailPengajuanGudangCabang !== undefined) {
      this.pengajuanService.approvalUH(detail.idDetailPengajuanGudangCabang).subscribe({
        next: (response) => {
          console.log('Approval response:', response);
          Swal.fire({
            title: 'Sukses',
            text: app ? 'Pengajuan telah disetujui.' : 'Pengajuan tidak disetujui.',
            icon: 'success',
          }).then(() => {
            if(this.allDetails.length > 1) {
              this.loadDetailPengajuan(this.id!);
            } else {
              this.goBack();
            }
            
          });
        },
        error: (error) => {
          console.error('Create approval error:', error);
          Swal.fire({
            title: 'Error',
            text: 'Terjadi kesalahan saat memproses persetujuan.',
            icon: 'error',
          });
        }
      });
    } else {
      console.error('ID Detail Pengajuan Gudang Cabang tidak ditemukan');
      Swal.fire('Error', 'ID Detail Pengajuan tidak ditemukan', 'error');
    }
  }

  goBack(): void {
    this.router.navigate(['/picg/approve-pengajuan']);
  }
}
