import { Component, OnInit } from '@angular/core';
import { IBarangCabang } from 'src/app/interfaces/gs/i-barang-cabang';
import { KategoriBarangService } from 'src/app/services/gs/kategori-barang.service';
import { CabangService } from 'src/app/services/cabang.service'
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { BarangCabang } from 'src/app/models/gs/barang-cabang'
import Swal from 'sweetalert2';
import { BarangService } from 'src/app/services/gs/barang.service';
import { BarangCabangService } from 'src/app/services/gs/barang-cabang.service'

@Component({
  selector: 'app-per',
  templateUrl: './per.component.html',
  styleUrls: ['./per.component.scss']
})
export class PerComponent implements OnInit{
  cabangList: string[] = [];
  kategoriList: string[] = [];
  barangCabangList: IBarangCabang[] = [];
  selectedKategori: string = '';
  selectedCabang: string = '';
  showSelectKategori: boolean = false;
  visiblePages: number[] = [];
  selectAll: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private kategoriBarangService: KategoriBarangService,
    private barangCabangService: BarangCabangService,
    private cabangService: CabangService,
    private barangService: BarangService) { }

  ngOnInit(): void {
    this.loadCabang();
    this.loadKategori();
  }

  loadCabang(): void {
    this.cabangService.getCabangList().subscribe({
      next: (response: ArrayDataResponse) => {
        this.cabangList = response.data;
      },
      error: (error) => {
        console.error('Gagal memuat data cabang:', error);
      }
    });
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


  loadBarangCabang(): void {
    if (!this.selectedCabang) {
      Swal.fire({
        title: 'Error',
        text: 'Anda belum memilih cabang!',
        icon: 'error',
      });
      return;
    }

    this.showSelectKategori = true;

    const params = new HttpParams()
    .set('kategori', this.selectedKategori)
    .set('searchTerm', this.searchTerm)
    .set('page', this.currentPage.toString())
    .set('size', this.pageSize.toString());

    this.barangCabangService.getBarangCabangList(this.selectedCabang, this.selectedKategori, this.searchTerm, this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IBarangCabang>) => {
        this.barangCabangList = response.content;
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

  onSearch(): void {
    this.loadBarangCabang();
  }

  toggleSelectAll() {
    this.barangCabangList.forEach(barangCabang => barangCabang.selected = this.selectAll);
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
    this.loadBarangCabang();
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

  deletBarangCabangSatuan(barangCabang: IBarangCabang): void {
    Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin menghapus barang "${barangCabang.namaBarang}" dari cabang "${this.selectedCabang}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        if (barangCabang.idBarangCabang) {
          this.deleteBarangCabang(barangCabang.idBarangCabang);
        }
      }
    });
  }

  deleteSelectedBarang(): void {
    const selectedBarang = this.barangCabangList.filter(barangCabang => barangCabang.selected);
  
    if (selectedBarang.length === 0) {
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
        selectedBarang.forEach(barangCabang => {
          if (barangCabang.idBarangCabang) {
            this.deleteBarangCabang(barangCabang.idBarangCabang);
          }
        });
      }
    });
  }

  deleteBarangCabang(idBarangCabang: number): void {
    this.barangCabangService.deleteBarangCabang(idBarangCabang).subscribe({
      next: () => {
        this.barangCabangList = this.barangCabangList.filter(barangCabang => barangCabang.idBarangCabang !== idBarangCabang);
        
        Swal.fire({
          title: 'Sukses',
          text: 'Barang berhasil dihapus.',
          icon: 'success',
        });
        this.loadBarangCabang();
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

  newBarangCabang: BarangCabang = new BarangCabang();
  addedBarangCabang: Record<number, BarangCabang> = {}; // Variabel untuk menyimpan data yang ditambahkan di modal
  showAddModal: boolean = false;
  namaBarangList: string[] = [];

  addBarangCabang(): void {
    if (this.addedBarangCabang[0]) {
      this.newBarangCabang = { ...this.addedBarangCabang[0] };
    } else {
      this.newBarangCabang = new BarangCabang();
    }

    this.newBarangCabang.cabang = this.selectedCabang;
    this.showAddModal = true;
  }

  onKategoriChange(): void {
    this.loadNamaBarangList();
    this.newBarangCabang.namaBarang = '';
  }

  loadNamaBarangList(): void {
    if (this.newBarangCabang.kategoriBarang) {
      this.barangService.getNamaBarangList(this.newBarangCabang.kategoriBarang).subscribe({
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

  onAddFormChange(): void {
    this.addedBarangCabang[0] = { ...this.newBarangCabang };
  }

  onSubmitAdd(): void {
    this.barangCabangService.createBarangCabang(this.newBarangCabang).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Sukses',
          text: 'Barang berhasil ditambahkan.',
          icon: 'success'
        }).then(() => {
          delete this.addedBarangCabang[0];
          this.showAddModal = false;
          this.loadBarangCabang();
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
