import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ITabPane } from 'src/app/interfaces/i-tab-pane';
import { IBarangGudang } from 'src/app/interfaces/pic-gudang/i-barang-gudang';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { KategoriBarangService } from 'src/app/services/gs/kategori-barang.service';
import { BarangGudangService } from 'src/app/services/pic-gudang/barang-gudang.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stok',
  templateUrl: './stok.component.html',
  styleUrls: ['./stok.component.scss']
})
export class StokComponent implements OnInit{
  kategoriList: string[] = [];
  selectedKategori: string = '';
  barangGudangList: IBarangGudang[] = [];
  visiblePages: number[] = [];
  selectAll: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  ca: boolean = false;
  da: boolean = false;

  panes: ITabPane[] = [
    { name: 'Create Approval', id: 'tab-create-approval'},
    { name: 'Delete Approval', id: 'tab-delete-approval'}
  ];

  activeTabPaneIdx: number = 0;

  constructor(
    private kategoriBarangService: KategoriBarangService,
    private barangGudangService: BarangGudangService) { }

  ngOnInit(): void {
    this.loadKategori();
    this.loadBarangGudang();
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

  loadBarangGudang(): void {
    const params = new HttpParams()
      .set('kategori', this.selectedKategori)
      .set('searchTerm', this.searchTerm)
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());
  
    const activeTabPane = this.panes[this.activeTabPaneIdx];
    if (activeTabPane.id === 'tab-create-approval') {
      this.ca = false;
      this.da = false;
    } else if (activeTabPane.id === 'tab-delete-approval') {
      this.ca = true;
      this.da = true;
    } else {
      console.error('Tab tidak valid.');
      return;
    }

    this.barangGudangService.getBarangGudangList(this.ca, this.da, this.selectedKategori, this.searchTerm, this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IBarangGudang>) => {
        this.barangGudangList = response.content;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.updateVisiblePages();
      },
      error: (error) => {
        console.error('Gagal memuat data barang:', error);
        Swal.fire({
          title: 'Error',
          text: 'Terjadi kesalahan saat memuat data barang.',
          icon: 'error',
        });
      }
    });
  }

  onTabChange(tabPaneIdx: number): void {
    this.activeTabPaneIdx = tabPaneIdx;
    this.loadBarangGudang();
  }

  onSearch(): void {
    this.loadBarangGudang();
  }

  toggleSelectAll() {
    this.barangGudangList.forEach(barang => barang.selected = this.selectAll);
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
    this.loadBarangGudang();
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

   // START OF APPROVAL

   approveCreate(id: number, app: boolean) {
    if (id !== undefined) {
      this.barangGudangService.approveCreate(id, app).subscribe({
        next: (response) => {
          console.log('Create approval response:', response);
          this.loadBarangGudang();
          Swal.fire({
            title: 'Sukses',
            text: app ? 'Item telah disetujui.' : 'Item tidak disetujui.',
            icon: 'success',
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
      console.error('ID Barang Gudang tidak ditemukan');
    }
  }

  approveDelete(id: number, app: boolean) {
    if (id !== undefined) {
      this.barangGudangService.approveDelete(id, app).subscribe({
        next: (response) => {
          console.log('Delete approval response:', response);
          this.loadBarangGudang(); // Refresh data setelah persetujuan
          Swal.fire({
            title: 'Sukses',
            text: app ? 'Penghapusan item disetujui.' : 'Penghapusan item tidak disetujui.',
            icon: 'success',
          });
        },
        error: (error) => {
          console.error('Delete approval error:', error);
          Swal.fire({
            title: 'Error',
            text: 'Terjadi kesalahan saat memproses persetujuan penghapusan.',
            icon: 'error',
          });
        }
      });
    } else {
      console.error('ID Barang Gudang tidak ditemukan');
    }
  }

  bulkApproveCreate(approve: boolean) {
    const selectedItems = this.barangGudangList.filter(barang => barang.selected);
    if (selectedItems.length === 0) {
      Swal.fire('Peringatan', 'Pilih setidaknya satu item untuk disetujui.', 'warning');
      return;
    }

    selectedItems.forEach(barang => {
      if (barang.idBarangGudang !== undefined) {
        this.barangGudangService.approveCreate(barang.idBarangGudang, approve).subscribe({
          next: (response) => {
            console.log('Create approval response:', response);
            this.loadBarangGudang(); // Refresh data setelah persetujuan
          },
          error: (error) => {
            console.error('Create approval error:', error);
            Swal.fire({
              title: 'Error',
              text: 'Terjadi kesalahan saat memproses persetujuan pembuatan.',
              icon: 'error',
            });
          }
        });
      } else {
        console.error('ID Barang Gudang tidak ditemukan');
      }
    });

    Swal.fire({
      title: 'Sukses',
      text: approve ? 'Semua item terpilih telah disetujui.' : 'Semua item terpilih tidak disetujui.',
      icon: 'success',
    });
  }

  bulkApproveDelete(approve: boolean) {
    const selectedItems = this.barangGudangList.filter(barang => barang.selected);
    if (selectedItems.length === 0) {
      Swal.fire('Peringatan', 'Pilih setidaknya satu item untuk disetujui penghapusannya.', 'warning');
      return;
    }

    selectedItems.forEach(barang => {
      if (barang.idBarangGudang !== undefined) {
        this.barangGudangService.approveDelete(barang.idBarangGudang, approve).subscribe({
          next: (response) => {
            console.log('Delete approval response:', response);
            this.loadBarangGudang(); // Refresh data setelah persetujuan
          },
          error: (error) => {
            console.error('Delete approval error:', error);
            Swal.fire({
              title: 'Error',
              text: 'Terjadi kesalahan saat memproses persetujuan penghapusan.',
              icon: 'error',
            });
          }
        });
      } else {
        console.error('ID Barang Gudang tidak ditemukan');
      }
    });

    Swal.fire({
      title: 'Sukses',
      text: approve ? 'Penghapusan semua item terpilih telah disetujui.' : 'Penghapusan semua item terpilih tidak disetujui.',
      icon: 'success',
    });
  }

}
