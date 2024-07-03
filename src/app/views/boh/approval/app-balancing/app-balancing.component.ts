import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { IDetailBalancing } from 'src/app/interfaces/pic-gudang/balancing/i-detail-balancing';
import { IReport } from 'src/app/interfaces/pic-gudang/balancing/i-report';
import { IReportBalancing } from 'src/app/interfaces/pic-gudang/balancing/i-report-balancing';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { KategoriBarangService } from 'src/app/services/gs/kategori-barang.service';
import { BalancingService } from 'src/app/services/pic-gudang/balancing.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-balancing',
  templateUrl: './app-balancing.component.html',
  styleUrls: ['./app-balancing.component.scss']
})
export class AppBalancingComponent {
  kategoriList: string[] = [];
  report: IReport | null = null;
  reportList: IReportBalancing[] = [];
  selectedKategori: string = '';
  selectedDate: string = '';
  isDataLoaded: boolean = false;

  app: boolean = false;
  rj: boolean = false;

  visiblePages: number[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private kategoriBarangService: KategoriBarangService,
    private balancingService: BalancingService) { }

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

  loadReportNoApprove(): void {
    if (!this.selectedDate || !this.selectedKategori) {
      Swal.fire('Error', 'Pilih tanggal dan kategori terlebih dahulu', 'error');
      return;
    }

    const params = new HttpParams()
    .set('page', this.currentPage.toString())
    .set('size', this.pageSize.toString());
    
    this.balancingService.getReport(this.selectedKategori, this.selectedDate, this.app, this.rj, this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IReport>) => {
        if (response.content.length > 0) {
          this.report = response.content[0]; 
          this.reportList = this.report.details; 
        } else {
          this.report = null;
          this.reportList = [];
        }
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.updateVisiblePages();
        this.isDataLoaded = true;
      },
      error: (error) => {
        console.error('Gagal memuat data balancing:', error);
        Swal.fire('Error', 'Terjadi kesalahan saat memuat data balancing', 'error');
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
    this.loadReportNoApprove();
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

  onDateChange(): void {
    this.currentPage = 1;
  }

  onKategoriChange(): void {
    this.currentPage = 1;
  }

  approveBalancing(app: boolean) {
    if (!this.report) {
      Swal.fire('Error', 'Tidak ada data yang dipilih', 'error');
      return;
    }
    
    this.balancingService.approveBalancing(this.report, app).subscribe(
      response => {
        console.log('Balancing process completed successfully', response);
        if (app) {
          Swal.fire({
            title: 'Success',
            text: 'Data berhasil di-approve',
            icon: 'success'
          }).then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            title: 'Info',
            text: 'Data akan direvisi',
            icon: 'info'
          }).then(() => {
            window.location.reload();
          });
        }
      },
      error => {
        console.error('Error processing balancing', error);
        Swal.fire('Error', 'Terjadi kesalahan saat memproses data', 'error');
      }
    );
  }

  onRevisi(): void {
    // Implementasi logika revisi
    Swal.fire('Info', 'Data akan direvisi', 'info');
  }

}
