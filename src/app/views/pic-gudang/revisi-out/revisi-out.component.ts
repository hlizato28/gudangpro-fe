import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPengajuanGudangCabang } from 'src/app/interfaces/pemohon/i-pengajuan-gudang-cabang';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { PengajuanGudangCabangService } from 'src/app/services/pemohon/pengajuan-gudang-cabang.service';
import { IDetailPengajuanGudangCabang } from 'src/app/interfaces/pemohon/i-detail-pengajuan-gudang-cabang'

@Component({
  selector: 'app-revisi-out',
  templateUrl: './revisi-out.component.html',
  styleUrls: ['./revisi-out.component.scss']
})
export class RevisiOutComponent implements OnInit {
  revisiList: IPengajuanGudangCabang[] = [];

  // Properti paginasi
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];

  idDetailBalancing: number = 0;
  idBalancing: number = 0;
  createdAt: number = 0;

  constructor(
    private route: ActivatedRoute,
    private pengajuanGudangCabangService: PengajuanGudangCabangService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idDetailBalancing = +params['id'];
    });

    this.route.queryParams.subscribe(queryParams => {
      this.idBalancing = +queryParams['ib'];
      this.createdAt = +queryParams['tg'];
    });

    this.loadRevisiOut();
  }

  loadRevisiOut(): void {
    this.pengajuanGudangCabangService.getRevisiOut(this.idDetailBalancing, this.createdAt, this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IPengajuanGudangCabang>) => {
        this.revisiList = response.content;
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
    this.loadRevisiOut();
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

  onApproved(item: IPengajuanGudangCabang): void {
    if (item.isApproved) {
      item.isApproved = false;
    } else {
      item.isApproved = true;
    }
  }

  allItemsApproved(): boolean {
    return this.revisiList.length > 0 && this.revisiList.every(item => item.isApproved);
  }

  goBack(): void {
    this.router.navigate(['/picg/balancing/revisi-detail', this.idBalancing], {
      queryParams: {
        tg: this.createdAt
      }
    });
  }


}
