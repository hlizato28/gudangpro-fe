import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IBarang } from 'src/app/interfaces/gs/i-barang'
import Swal from 'sweetalert2';
import { KategoriBarangService } from 'src/app/services/gs/kategori-barang.service';
import { BarangService } from 'src/app/services/gs/barang.service';
import { Barang } from 'src/app/models/gs/barang';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response'
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-barang',
  templateUrl: './barang.component.html',
  styleUrls: ['./barang.component.scss']
})
export class BarangComponent implements OnInit {
  kategoriList: string[] = [];
  barangList: IBarang[] = [];
  selectedKategori: string = '';

  visiblePages: number[] = [];
  selectAll: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private kategoriBarangService: KategoriBarangService,
    private barangService: BarangService) { }

  ngOnInit(): void {
    this.loadKategori();
    this.loadBarang();
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

  loadBarang(): void {
    const params = new HttpParams()
    .set('kategori', this.selectedKategori)
    .set('searchTerm', this.searchTerm)
    .set('page', this.currentPage.toString())
    .set('size', this.pageSize.toString());

    this.barangService.getBarangList(this.selectedKategori, this.searchTerm, this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IBarang>) => {
        this.barangList = response.content;
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
    this.loadBarang();
  }

  toggleSelectAll() {
    this.barangList.forEach(barang => barang.selected = this.selectAll);
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
    this.loadBarang();
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

  deletBarangSatuan(barang: IBarang): void {
    Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin menghapus barang "${barang.namaBarang}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        if (barang.idBarang) {
          this.deleteBarang(barang.idBarang);
        }
      }
    });
  }

  deleteSelectedBarang(): void {
    const selectedBarang = this.barangList.filter(barang => barang.selected);
  
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
        selectedBarang.forEach(barang => {
          if (barang.idBarang) {
            this.deleteBarang(barang.idBarang);
          }
        });
      }
    });
  }

  deleteBarang(idBarang: number): void {
    this.barangService.deleteBarang(idBarang).subscribe({
      next: () => {
        this.barangList = this.barangList.filter(barang => barang.idBarang !== idBarang);
        
        Swal.fire({
          title: 'Sukses',
          text: 'Barang berhasil dihapus.',
          icon: 'success',
        });
        this.loadBarang();
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

  // START OF UPDATE

  selectedBarang: IBarang = new Barang();
  editedBarang: Record<number, IBarang> = {}; // Variabel untuk menyimpan data yang diedit di modal
  showEditModal: boolean = false;
  kategori: string = '';

  editBarang(barang: IBarang): void {
    if (!this.editedBarang[barang.idBarang!]) {
      this.editedBarang[barang.idBarang!] = { ...barang };
    }

    this.selectedBarang = { ...this.editedBarang[barang.idBarang!] };
    this.kategori = this.selectedBarang.kategoriBarang;
    this.showEditModal = true;
  }

  cancelEdit(): void {
    this.showEditModal = false;
  }

  onSubmitEdit(): void {
    if (this.selectedBarang) {
      this.barangService.editBarang(this.selectedBarang).subscribe({
        next: () => {
          Swal.fire({
            title: 'Sukses',
            text: 'Barang berhasil diperbarui.',
            icon: 'success',
          }).then(() => {
            this.editedBarang = {};
            this.showEditModal = false;
            this.loadBarang();
          });
        },
        error: (error) => {
          console.error('Error updating barang:', error);
          Swal.fire({
            title: 'Error',
            text: error.error.message,
            icon: 'error',
          });
        }
      });
    }
  }

  onEditFormChange(): void {
    if (this.selectedBarang) {
      this.selectedBarang.kategoriBarang = this.kategori
      this.editedBarang[this.selectedBarang.idBarang!] = { ...this.selectedBarang };
    }
  }

  // START OF CREATE

  newBarang: Barang = new Barang();
  addedBarang: Record<number, Barang> = {}; // Variabel untuk menyimpan data yang ditambahkan di modal
  showAddModal: boolean = false;

  addBarang(): void {
    if (this.addedBarang[0]) {
      this.newBarang = { ...this.addedBarang[0] };
    } else {
      this.newBarang = new Barang();
    }

    this.showAddModal = true;
  }

  onAddFormChange(): void {
    this.addedBarang[0] = { ...this.newBarang };
  }

  onSubmitAdd(): void {
    this.barangService.createBarang(this.newBarang).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Sukses',
          text: 'Barang berhasil ditambahkan.',
          icon: 'success'
        }).then(() => {
          delete this.addedBarang[0];
          this.showAddModal = false;
          this.loadBarang();
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
