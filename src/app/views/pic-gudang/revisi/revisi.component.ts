import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IBalancing } from 'src/app/interfaces/pic-gudang/balancing/i-balancing';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { BalancingService } from 'src/app/services/pic-gudang/balancing.service';

@Component({
  selector: 'app-revisi',
  templateUrl: './revisi.component.html',
  styleUrls: ['./revisi.component.scss']
})
export class RevisiComponent implements OnInit{
  revisiList: IBalancing[] = [];

  visiblePages: number[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private balancingService: BalancingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRevisi();
  }

  loadRevisi(): void {
    this.balancingService.getRevisi(this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IBalancing>) => {
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
    this.loadRevisi();
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

  goToDetail(idBalancing?: number, createdAt?: Date): void {
    if (idBalancing) {
      this.router.navigate(['/picg/balancing/revisi-detail', idBalancing],
        {
          queryParams: {
            tg: createdAt
          }
        }
      ).then(() => {
        console.log('Navigation complete');
      }).catch(error => {
        console.error('Navigation error:', error);
      });
    } else {
      console.error('ID Pengajuan tidak valid');
    }
  }
}