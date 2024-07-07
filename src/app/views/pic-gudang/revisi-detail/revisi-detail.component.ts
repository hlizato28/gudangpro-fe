import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDetailBalancing } from 'src/app/interfaces/pic-gudang/balancing/i-detail-balancing';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { BalancingService } from 'src/app/services/pic-gudang/balancing.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-revisi-detail',
  templateUrl: './revisi-detail.component.html',
  styleUrls: ['./revisi-detail.component.scss']
})
export class RevisiDetailComponent implements OnInit{
  revisiDetailList: IDetailBalancing[] = [];

  visiblePages: number[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  idBalancing: number = 0;
  createdAt: number = 0;

  constructor(
    private route: ActivatedRoute,
    private balancingService: BalancingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idBalancing = +params['id'];
      if (this.idBalancing) {
        this.loadRevisiDetail(this.idBalancing);
      } else {
        console.error('ID Balancing tidak valid');
      }
    });

    this.route.queryParams.subscribe(queryParams => {
      this.createdAt = +queryParams['tg'];
    });
  }

  loadRevisiDetail(id: number): void {
    this.balancingService.getRevisiDetail(id, this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IDetailBalancing>) => {
          this.revisiDetailList = response.content;
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
    if (this.idBalancing !== null) {
      this.loadRevisiDetail(this.idBalancing);
    } else {
      console.error('ID tidak tersedia');
    }
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

  onApproved(item: IDetailBalancing): void {
    if (item.isApproved) {
      item.isApproved = false;
    } else {
      item.isApproved = true;
    }
  }

  allItemsApproved(): boolean {
    return this.revisiDetailList.length > 0 && this.revisiDetailList.every(item => item.isApproved);
  }

  saveRevisi(): void {
    this.balancingService.revisiBalancing(this.idBalancing).subscribe({
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

  goToRevisiOut(idBarangGudang: number, idDetailBalancing: number): void {
    this.router.navigate(['/picg/balancing/revisi-out', idBarangGudang], {
      queryParams: {
        ib: this.idBalancing,
        tg: this.createdAt,
        idb: idDetailBalancing
      }
    }).then(() => {
      console.log('Navigation to revisi-out complete');
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }

  goBack(): void {
    this.router.navigate(['/picg/balancing/revisi']);
  }
}