import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IBarangGudang } from 'src/app/interfaces/pic-gudang/i-barang-gudang'
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { KategoriBarangService } from 'src/app/services/gs/kategori-barang.service';
import { BarangGudangService } from 'src/app/services/pic-gudang/barang-gudang.service';
import { BarangGudang } from 'src/app/models/pic-gudang/barang-gudang'
import Swal from 'sweetalert2';
import { BarangService } from 'src/app/services/gs/barang.service';
import { GenericDataResponse } from 'src/app/interfaces/responses/generic-data-response';
import { IBarang } from 'src/app/interfaces/gs/i-barang';
import { BarangCabangService } from 'src/app/services/gs/barang-cabang.service';

@Component({
  selector: 'app-stok-item',
  templateUrl: './stok-item.component.html',
  styleUrls: ['./stok-item.component.scss']
})
export class StokItemComponent implements OnInit {
  kategoriList: string[] = [];
  selectedKategori: string = '';
  barangGudangList: IBarangGudang[] = [];
  needCreateApprovalList: IBarangGudang[] = [];
  needDeleteApprovalList: IBarangGudang[] = [];
  visiblePages: number[] = [];
  selectAll: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private kategoriBarangService: KategoriBarangService,
    private barangGudangService: BarangGudangService,
    private barangService: BarangService,
    private barangCabangService: BarangCabangService) { }

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

    this.barangGudangService.getBarangGudangList(true, false, this.selectedKategori, this.searchTerm, this.currentPage - 1, this.pageSize).subscribe({
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

    this.barangGudangService.getBarangGudangList(false, false, this.selectedKategori, this.searchTerm, 0, 1000).subscribe({
      next: (response: ListDataResponse<IBarangGudang>) => {
        this.needCreateApprovalList = response.content;
      },
      error: (error) => {
        console.error('Gagal memuat data barang yang membutuhkan persetujuan pembuatan:', error);
      }
    });
  
    // Load items that need delete approval (ca: true, da: true)
    this.barangGudangService.getBarangGudangList(true, true, this.selectedKategori, this.searchTerm, 0, 1000).subscribe({
      next: (response: ListDataResponse<IBarangGudang>) => {
        this.needDeleteApprovalList = response.content;
      },
      error: (error) => {
        console.error('Gagal memuat data barang yang membutuhkan persetujuan penghapusan:', error);
      }
    });
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

  //START OF DELETE

  deleteBarangGudangSatuan(barangGudang: IBarangGudang): void {
    Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin menghapus barang "${barangGudang.namaBarang}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        if (barangGudang.idBarangGudang) {
          this.deleteBarangGudang(barangGudang.idBarangGudang);
        }
      }
    });
  }

  deleteSelectedBarangGudang(): void {
    const selectedBarangGudang = this.barangGudangList.filter(barangGudang => barangGudang.selected);
  
    if (selectedBarangGudang.length === 0) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Anda belum memilih barang yang akan dihapus.',
        icon: 'warning',
      });
      return;
    }
  
    Swal.fire({
      title: 'Konfirmasi',
      text: 'Apakah Anda yakin ingin menghapus barang yang dipilih?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        selectedBarangGudang.forEach(barangGudang => {
          if (barangGudang.idBarangGudang) {
            this.deleteBarangGudang(barangGudang.idBarangGudang);
          }
        });
      }
    });
  }

  deleteBarangGudang(idBarangGudang: number): void {
    this.barangGudangService.deleteBarangGudang(idBarangGudang).subscribe({
      next: () => {
        this.barangGudangList = this.barangGudangList.filter(barangGudang => barangGudang.idBarangGudang !== idBarangGudang);
        
        Swal.fire({
          title: 'Sukses',
          text: 'Silahkan tunggu approval BOH.',
          icon: 'info',
        });
        this.loadBarangGudang();
      },
      error: (error) => {
        console.error('Gagal menghapus barang:', error);
        
        Swal.fire({
          title: 'Error',
          text: 'Terjadi kesalahan saat menghapus barang.',
          icon: 'error',
        });
      }
    });
  }

  // START OF CREATE

  newBarangGudang: BarangGudang = new BarangGudang();
  showAddModal: boolean = false;
  namaBarangList: string[] = [];

  addBarangGudang(): void {
    this.showAddModal = true;
  }

  onKategoriChange(): void {
    this.loadNamaBarangList();
    this.newBarangGudang.namaBarang = '';
  }

  loadNamaBarangList(): void {
    if (this.newBarangGudang.kategori) {
      this.barangCabangService.getNamaBarangCabangList(this.newBarangGudang.kategori).subscribe({
        next: (response: ArrayDataResponse) => {
          this.namaBarangList = response.data;
        },
        error: (error) => {
          console.error('Gagal memuat data nama barang:', error);
          Swal.fire({
            title: 'Error',
            text: 'Gagal memuat data nama barang.',
            icon: 'error',
          });
        }
      });
    }
  }

  loadByNamaBarang(): void {
    if (this.newBarangGudang.namaBarang) {
      this.barangService.getBarangByNama(this.newBarangGudang.namaBarang).subscribe({
        next: (response: GenericDataResponse<IBarang>) => {
          if (response.data) {
            this.newBarangGudang.kodeBarang = response.data.kodeBarang;
            this.newBarangGudang.satuan = response.data.satuan;
          } else {
            console.warn('Data barang tidak ditemukan');
          }
        },
        error: (error) => {
          console.error('Gagal memuat data nama barang:', error);
          Swal.fire({
            title: 'Error',
            text: 'Gagal memuat data nama barang.',
            icon: 'error',
          });
        }
      });
    }
  }

  onSubmitAdd(): void {
    this.barangGudangService.createBarangGudang(this.newBarangGudang).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Sukses',
          text: 'Silahkan tunggu approval BOH.',
          icon: 'info'
        }).then(() => {
          // delete this.addedBarangCabang[0];
          this.showAddModal = false;
          this.loadBarangGudang();
        });
      },
      error: (error) => {
        console.error('Gagal menambahkan barang:', error);
        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error'
        });
      }
    });
  }

  cancelAddBarang(): void {
    this.showAddModal = false;
  }



}
