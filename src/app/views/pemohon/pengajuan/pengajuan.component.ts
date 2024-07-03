import { Component, OnInit } from '@angular/core';
import { DetailPengajuanGudangCabang } from 'src/app/models/pemohon/detail-pengajuan-gudang-cabang';
import { PengajuanGudangCabang } from 'src/app/models/pemohon/pengajuan-gudang-cabang'
import { KategoriBarangService } from 'src/app/services/gs/kategori-barang.service';
import { BarangGudangService } from 'src/app/services/pic-gudang/barang-gudang.service';
import { PengajuanGudangCabangService } from 'src/app/services/pemohon/pengajuan-gudang-cabang.service'
import { BarangService } from 'src/app/services/gs/barang.service';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { UserService } from 'src/app/services/admin/user.service';
import { GenericDataResponse } from 'src/app/interfaces/responses/generic-data-response';
import { IUser } from 'src/app/interfaces/admin/user/i-user';
import { User } from 'src/app/models/admin/user';
import Swal from 'sweetalert2';
import { IBarang } from 'src/app/interfaces/gs/i-barang';
import { IBarangGudang } from 'src/app/interfaces/pic-gudang/i-barang-gudang';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { BehaviorSubject, finalize, retry } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-pengajuan',
  templateUrl: './pengajuan.component.html',
  styleUrls: ['./pengajuan.component.scss']
})
export class PengajuanComponent implements OnInit{
  currentUser: User = new User;
  kategoriList: string[] = [];
  barangGudangList: string[] = [];

  pengajuan: PengajuanGudangCabang = new PengajuanGudangCabang();
  detailPengajuan: DetailPengajuanGudangCabang = new DetailPengajuanGudangCabang();

  selectedKategori: string = '';
  showSelectKategori: boolean = true;
  showAddModal: boolean = false;

  temporaryStock: { [namaBarang: string]: number } = {};

  constructor(
    private kategoriBarangService: KategoriBarangService,
    private barangGudangService: BarangGudangService,
    private pengajuanGudangCabangService: PengajuanGudangCabangService,
    private barangService: BarangService,
    private userService: UserService ,
    private loadingService: LoadingService 
  ) { }

  ngOnInit(): void {
    this.loadKategori();
    this.loadCurrentUser();

    this.pengajuan = {
      user: this.currentUser.nama,
      details: []
    };   
    
    this.initializeTemporaryStock();
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (response: GenericDataResponse<IUser>) => {
        this.currentUser = response.data;
      },
      error: (error) => {
        console.error('Gagal memuat data user:', error);
      }
    });
  }
  initializeTemporaryStock(): void {
    const PAGE_SIZE = 200;
    let currentPage = 0;
  
    const loadPage = (page: number) => {
      this.loadingService.setLoading(true);
      this.barangGudangService.getBarangGudangList(true, false, '', '', page, PAGE_SIZE)
        .pipe(
          retry(3),
          finalize(() => this.loadingService.setLoading(false))
        )
        .subscribe({
          next: (response: ListDataResponse<IBarangGudang>) => {
            response.content.forEach(barang => {
              this.temporaryStock[barang.namaBarang] = barang.jumlah;
            });
  
            if (response.content.length === PAGE_SIZE) {
              loadPage(page + 1);
            }
          },
          error: (error) => {
            console.error('Gagal memuat data stok:', error);
            Swal.fire('Error', 'Gagal memuat data stok. Silakan coba lagi.', 'error');
          }
        });
    };
  
    loadPage(currentPage);
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

  loadNamaBarangList(): void {
    if (this.selectedKategori) {
      this.barangGudangService.getNamaBarangGudangList(this.selectedKategori).subscribe({
        next: (response: ArrayDataResponse) => {
          // Filter barang berdasarkan stok yang tersedia di temporaryStock
          this.barangGudangList = response.data.filter(barang => {
            const availableStock = this.temporaryStock[barang];
            return availableStock !== undefined && availableStock > 0;
          });
  
          // Jika tidak ada barang yang tersedia, tampilkan pesan
          if (this.barangGudangList.length === 0) {
            Swal.fire('Info', 'Tidak ada barang dengan stok tersedia untuk kategori ini', 'info');
          }
        },
        error: (error) => {
          console.error('Gagal memuat daftar nama barang:', error);
          Swal.fire('Error', 'Gagal memuat daftar nama barang', 'error');
        }
      });
    }
  }

  loadByNamaBarang(): void {
    if (this.detailPengajuan.namaBarang) {
      this.barangService.getBarangByNama(this.detailPengajuan.namaBarang).subscribe({
        next: (response: GenericDataResponse<IBarang>) => {
          if (response.data) {
            this.detailPengajuan.kodeBarang = response.data.kodeBarang;
            this.detailPengajuan.satuan = response.data.satuan;
            this.detailPengajuan.stok = this.temporaryStock[response.data.namaBarang] || 0;
          } else {
            console.warn('Barang tidak ditemukan');
            Swal.fire('Warning', 'Barang tidak ditemukan', 'warning');
          }
        },
        error: (error) => {
          console.error('Gagal mengambil data barang:', error);
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    }
  }

  addPengajuan(): void {
    this.detailPengajuan = new DetailPengajuanGudangCabang();
    this.showAddModal = true;
    this.showSelectKategori = true;
    this.selectedKategori = '';
  }

  onKategoriChange(): void {
    this.loadNamaBarangList();
    this.detailPengajuan = new DetailPengajuanGudangCabang();
  }

  validateDetailPengajuan(): boolean {
    if (!this.detailPengajuan.namaBarang || !this.detailPengajuan.jumlahDiminta || this.detailPengajuan.jumlahDiminta <= 0) {
      Swal.fire('Error', 'Silahkan isi form dengan benar', 'error');
      return false;
    }

    const availableStock = this.temporaryStock[this.detailPengajuan.namaBarang] || 0;

    if (this.detailPengajuan.jumlahDiminta > availableStock) {
      Swal.fire('Error', `Stok untuk ${this.detailPengajuan.namaBarang} tidak mencukupi.`, 'error');
      return false;
    }
    return true;
  }

  onSubmitAdd(): void {
    if (this.validateDetailPengajuan()) {
      this.updateTemporaryStock(this.detailPengajuan.namaBarang, -this.detailPengajuan.jumlahDiminta);
      this.pengajuan.details.push({ ...this.detailPengajuan });
      this.showAddModal = false;
      Swal.fire('Success', 'Item ditambahkan ke pengajuan', 'success');
    }
  }

  updateTemporaryStock(namaBarang: string, amount: number): void {
    if (this.temporaryStock[namaBarang] !== undefined) {
      this.temporaryStock[namaBarang] += amount;
    }
  }

  cancelAddItem(): void {
    this.showAddModal = false;
    this.selectedKategori = '';
  }

  editItem(index: number): void {
    this.detailPengajuan = { ...this.pengajuan.details[index] };
    this.showSelectKategori = false;
    this.showAddModal = true;
  }

  deleteItem(index: number): void {
    if (index >= 0 && index < this.pengajuan.details.length) {
      const itemToDelete = this.pengajuan.details[index];
      Swal.fire({
        title: 'Anda yakin?',
        text: `Apakah Anda yakin ingin menghapus ${itemToDelete.namaBarang}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateTemporaryStock(itemToDelete.namaBarang, itemToDelete.jumlahDiminta);
          this.pengajuan.details.splice(index, 1);
          Swal.fire('Terhapus!', `${itemToDelete.namaBarang} telah dihapus.`, 'success');
        }
      });
    } else {
      console.error('Invalid index for deletion');
      Swal.fire('Error', 'Terjadi kesalahan saat menghapus item', 'error');
    }
  }

  validatePengajuan(): boolean {
    if (this.pengajuan.details.length === 0) {
      Swal.fire('Error', 'Anda belum menambahkan item pengajuan', 'error');
      return false;
    }
    return true;
  }

  submitPengajuan(): void {
    if (this.validatePengajuan()) {
      this.pengajuanGudangCabangService.create(this.pengajuan).subscribe({
        next: (response) => {
          Swal.fire('Success', 'Pengajuan berhasil dibuat', 'success');
          this.resetForm();
        },
        error: (error) => {
          console.error('Failed to submit pengajuan:', error);
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    }
  }

  resetForm(): void {
    this.pengajuan = new PengajuanGudangCabang();
    this.pengajuan = {
      user: this.currentUser.nama,
      details: []
    };
  }

  

}
