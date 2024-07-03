import { Component } from '@angular/core';
import { IReport } from 'src/app/interfaces/pic-gudang/balancing/i-report';
import { IReportBalancing } from 'src/app/interfaces/pic-gudang/balancing/i-report-balancing';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { KategoriBarangService } from 'src/app/services/gs/kategori-barang.service';
import { BalancingService } from 'src/app/services/pic-gudang/balancing.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hist-balancing',
  templateUrl: './hist-balancing.component.html',
  styleUrls: ['./hist-balancing.component.scss']
})
export class HistBalancingComponent {
  kategoriList: string[] = [];
  report: IReport | null = null;
  reportList: IReportBalancing[] = [];
  selectedKategori: string = '';
  selectedDate: string = '';
  isDataLoaded: boolean = false;

  app: boolean = true;
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
    this.loadReportWithApprove();
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

  loadReportWithApprove(): void {
    if (!this.selectedDate || !this.selectedKategori) {
      Swal.fire('Error', 'Pilih tanggal dan kategori terlebih dahulu', 'error');
      return;
    }
    
    this.balancingService.getReport(this.selectedKategori, this.selectedDate, this.app, this.rj, this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IReport>) => {
        this.reportList = response.content.flatMap(report => report.details);
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
  
  // async exportToPDF(): Promise<void> {
  //   if (!this.selectedDate || !this.selectedKategori) {
  //     Swal.fire('Error', 'Pilih tanggal dan kategori terlebih dahulu', 'error');
  //     return;
  //   }
  
  //   try {
  //     const allData = await this.balancingService.getAllReport(this.selectedKategori, this.selectedDate, this.app, this.rj).toPromise();
  
  //     if (!allData || allData.length === 0) {
  //       Swal.fire('Error', 'Tidak ada data untuk diekspor', 'error');
  //       return;
  //     }
  
  //     const content = this.generatePDFContent(allData);
  //     const filename = `balancing_${this.selectedKategori}_${this.selectedDate}.pdf`;
  //     this.exportToPdf.exportToPDF(content, filename);
  //   } catch (error) {
  //     console.error('Error exporting PDF:', error);
  //     Swal.fire('Error', 'Terjadi kesalahan saat mengekspor PDF', 'error');
  //   } finally {
  //     // this.isLoading = false;
  //   }
  }
  
  // private generatePDFContent(data: IReportBalancing[]): string {
  //   return `
  //     <div style="font-family: Arial, sans-serif;">
  //       <h2>Balancing Item</h2>
  //       <p>Tanggal: ${new Date(this.selectedDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  //       <p>Kategori: ${this.selectedKategori}</p>
  //       <table style="width: 100%; border-collapse: collapse;">
  //         <!-- ... header tabel ... -->
  //         <tbody>
  //           ${data.map((item, index) => `
  //             <tr>
  //               <td style="border: 1px solid black; padding: 5px;">${index + 1}</td>
  //               <td style="border: 1px solid black; padding: 5px;">${item.kodeBarang}</td>
  //               <td style="border: 1px solid black; padding: 5px;">${item.namaBarang}</td>
  //               <td style="border: 1px solid black; padding: 5px;">${item.stokAwal}</td>
  //               <td style="border: 1px solid black; padding: 5px;">${item.barangIn}</td>
  //               <td style="border: 1px solid black; padding: 5px;">${item.barangOut}</td>
  //               <td style="border: 1px solid black; padding: 5px;">${item.stokAhkhir}</td>
  //               <td style="border: 1px solid black; padding: 5px; background-color: #3c7ab7; color: white;">${item.opr}</td>
  //               <td style="border: 1px solid black; padding: 5px; background-color: #3c7ab7; color: white;">${item.uc}</td>
  //               <td style="border: 1px solid black; padding: 5px; background-color: #3c7ab7; color: white;">${item.nc}</td>
  //               <td style="border: 1px solid black; padding: 5px; background-color: #3c7ab7; color: white;">${item.kkb}</td>
  //               <td style="border: 1px solid black; padding: 5px; background-color: #3c7ab7; color: white;">${item.ds}</td>
  //               <td style="border: 1px solid black; padding: 5px; background-color: #3c7ab7; color: white;">${item.asr}</td>
  //             </tr>
  //           `).join('')}
  //         </tbody>
  //       </table>
  //     </div>
  //   `;
  // }




