import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPengajuanGudangCabang } from 'src/app/interfaces/pemohon/i-pengajuan-gudang-cabang';
import { GenericDataResponse } from 'src/app/interfaces/responses/generic-data-response';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { PengajuanGudangCabangService } from 'src/app/services/pemohon/pengajuan-gudang-cabang.service';

@Component({
  selector: 'app-approve-pengajuan',
  templateUrl: './approve-pengajuan.component.html',
  styleUrls: ['./approve-pengajuan.component.scss']
})
export class ApprovePengajuanComponent implements OnInit {
  pengajuanList: IPengajuanGudangCabang[] = [];

  visiblePages: number[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private pengajuanGudangCabangService: PengajuanGudangCabangService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPengajuanData();
  }

  loadPengajuanData(): void {
    this.pengajuanGudangCabangService.getDetailPengajuanByCabang(this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IPengajuanGudangCabang>) => {
        this.pengajuanList = response.content;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.updateVisiblePages();
      },
      error: (error) => {
        console.error('Gagal memuat data pengajuan:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
    this.loadPengajuanData();
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

  goToDetail(idPengajuanGudangCabang?: number): void {
    console.log('Navigating to:', idPengajuanGudangCabang);
    if (idPengajuanGudangCabang) {
      this.router.navigate(['/picg/approve-detail-pengajuan', idPengajuanGudangCabang]).then(() => {
        console.log('Navigation complete');
      }).catch(error => {
        console.error('Navigation error:', error);
      });
    } else {
      console.error('ID Pengajuan tidak valid');
    }
  }
}