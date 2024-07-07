import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IDetailBalancing } from 'src/app/interfaces/pic-gudang/balancing/i-detail-balancing';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { KategoriBarangService } from 'src/app/services/gs/kategori-barang.service';
import { BalancingService } from 'src/app/services/pic-gudang/balancing.service'
import Swal from 'sweetalert2';
import { IBalancing } from 'src/app/interfaces/pic-gudang/balancing/i-balancing'

function removeUnnecessaryProperties(obj: any): any {
  const { isApproved, selected, kategori, ...rest } = obj;
  return rest;
}

@Component({
  selector: 'app-balancing',
  templateUrl: './balancing.component.html',
  styleUrls: ['./balancing.component.scss']
})
export class BalancingComponent implements OnInit{
  kategoriList: string[] = [];
  balancingList: IDetailBalancing[] = [];
  selectedKategori: string = '';
  selectedDate: string = '';
  isDataLoaded: boolean = false;

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

  loadBalancing(): void {
    if (!this.selectedDate || !this.selectedKategori) {
      Swal.fire('Error', 'Pilih tanggal dan kategori terlebih dahulu', 'error');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset waktu ke 00:00:00

    const selectedDate = new Date(this.selectedDate);
    selectedDate.setHours(0, 0, 0, 0); // Reset waktu ke 00:00:00

    if (selectedDate > today) {
      Swal.fire('Error', 'Tanggal tidak bisa melebihi tanggal hari ini', 'error');
      return;
    }
    
    const params = new HttpParams()
      .set('kategori', this.selectedKategori)
      .set('tanggal', this.selectedDate)
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());

    this.balancingService.getDetailBalancing(this.selectedKategori, this.selectedDate, this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IDetailBalancing>) => {
        this.balancingList = response.content.map(item => ({...item, isApproved: false}));
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.updateVisiblePages();
        this.isDataLoaded = true;
      },
      error: (error) => {
        console.error('Gagal memuat data balancing:', error);
        Swal.fire({
          title: 'Error',
          text: 'Terjadi kesalahan saat memuat data balancing.',
          icon: 'error',
        });
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
    this.loadBalancing();
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

  onApprove(item: IDetailBalancing): void {
    if (item.isApproved) {
      item.isApproved = false;
    } else {
      item.isApproved = true;
    }
  }

  allItemsApproved(): boolean {
    return this.balancingList.length > 0 && this.balancingList.every(item => item.isApproved);
  }

  resetAfterSubmit(): void {
    this.balancingList = [];
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.selectedKategori = '';
    this.currentPage = 1;
    this.totalItems = 0;
    this.totalPages = 0;
    this.visiblePages = [];
  }

  onSubmitBalancing(): void {
    const approvedItems = this.balancingList.filter(item => item.isApproved);
    if (approvedItems.length === 0) {
      Swal.fire('Error', 'Tidak ada item yang disetujui untuk dibalancing', 'error');
      return;
    }

    const balancingDTO: IBalancing = {
      details: approvedItems.map(item => removeUnnecessaryProperties(item))
    };
  
    this.balancingService.balancing(balancingDTO).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Sukses',
          text: 'Balancing berhasil diproses.',
          icon: 'success'
        }).then(() => {
          this.resetAfterSubmit();
        });
      },
      error: (error) => {
        console.error('Gagal memproses balancing:', error);
        Swal.fire({
          title: 'Error',
          text: error.error.message || 'Terjadi kesalahan saat memproses balancing.',
          icon: 'error'
        });
      }
    });
  }
}
