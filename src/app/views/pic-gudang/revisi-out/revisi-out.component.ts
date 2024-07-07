import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPengajuanGudangCabang } from 'src/app/interfaces/pemohon/i-pengajuan-gudang-cabang';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { PengajuanGudangCabangService } from 'src/app/services/pemohon/pengajuan-gudang-cabang.service';
import { IDetailPengajuanGudangCabang } from 'src/app/interfaces/pemohon/i-detail-pengajuan-gudang-cabang'
import Swal from 'sweetalert2';

function removeUnnecessaryProperties(obj: any): any {
  const { isApproved, selected, ...rest } = obj;
  return rest;
}

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

  idBarangGudang: number = 0;
  idDetailBalancing: number = 0;
  idBalancing: number = 0;
  createdAt: number = 0;
  selectedKategori: string = '';

  constructor(
    private route: ActivatedRoute,
    private pengajuanGudangCabangService: PengajuanGudangCabangService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idBarangGudang = +params['id'];
    });

    this.route.queryParams.subscribe(queryParams => {
      this.idBalancing = queryParams['ib'] ? +queryParams['ib'] : 0;
      this.createdAt = +queryParams['tg'];
      this.idDetailBalancing = +queryParams['idb'];
      this.selectedKategori = queryParams['kat'] ? queryParams['kat'] : '';
    });

    this.loadRevisiOut();
  }

  loadRevisiOut(): void {
    this.pengajuanGudangCabangService.getRevisiOut(this.idBarangGudang, this.createdAt, this.currentPage - 1, this.pageSize).subscribe({
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

  saveRevisi(): void {
    const cleanedData = this.revisiList.map(removeUnnecessaryProperties);

    this.pengajuanGudangCabangService.revisiDetailPengajuan(this.idDetailBalancing, cleanedData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Sukses',
          text: 'Revisi Tersimpan',
          icon: 'success',
        }).then(() => {
          this.goBack();
        });
      },
      error: (error) => {
        console.error('Error revisi barang:', error);
        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error',
        });
      }
    });
  }

  goBack(): void {
    if (this.idBalancing !== 0) {
      this.router.navigate(['/picg/balancing/revisi-detail', this.idBalancing], {
        queryParams: {
          tg: this.createdAt
        }
      });
    } else {
      this.router.navigate(['/picg/balancing/balancing'], {
        queryParams: {
          kat: this.selectedKategori,
          tg: this.convertToDateString(this.createdAt)
        }
      });
    }
  }

  convertToDateString(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0]; 
  }


}
