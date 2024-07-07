import { Component } from '@angular/core';
import { IReport } from 'src/app/interfaces/pic-gudang/balancing/i-report';
import { IReportBalancing } from 'src/app/interfaces/pic-gudang/balancing/i-report-balancing';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { KategoriBarangService } from 'src/app/services/gs/kategori-barang.service';
import { BalancingService } from 'src/app/services/pic-gudang/balancing.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { RowInput, UserOptions } from 'jspdf-autotable';

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

  exportToPDF() {
    if (!this.isDataLoaded) {
      Swal.fire('Error', 'Data belum dimuat. Silakan muat data terlebih dahulu.', 'error');
      return;
    }

    const pdf = new jsPDF('l', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    
    // Rata tengah judul
    pdf.setFontSize(16);
    const title = `Report Balancing (${this.selectedKategori})`;
    const titleWidth = pdf.getStringUnitWidth(title) * pdf.getFontSize() / pdf.internal.scaleFactor;
    pdf.text(title, (pageWidth - titleWidth) / 2, 15);
    
    // Rata tengah tanggal
    pdf.setFontSize(10);
    const date = `Date: ${this.selectedDate}`;
    const dateWidth = pdf.getStringUnitWidth(date) * pdf.getFontSize() / pdf.internal.scaleFactor;
    pdf.text(date, (pageWidth - dateWidth) / 2, 25);

    const columns = [
      'No.', 'Kode', 'Nama Barang', 'Stok Awal', 'Barang In', 'Barang Out', 'Stok Akhir', 
      'OPR', 'UC', 'NC', 'KKB', 'DS', 'ASR'
    ];

    const data = this.getTableData();

    // Hitung total lebar tabel
    const columnWidths = [10, 20, 70, 20, 20, 20, 20, 10, 10, 10, 10, 10, 10];
    const totalTableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    
    // Hitung posisi awal tabel (untuk membuatnya berada di tengah)
    const startX = (pageWidth - totalTableWidth) / 2;

    (pdf as any).autoTable({
      head: [columns],
      body: data,
      startY: 35,
      tableWidth: totalTableWidth,
      margin: { left: startX },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 10 },  // No.
        1: { cellWidth: 20 },  // Kode
        2: { cellWidth: 70 },  // Nama Barang
        3: { cellWidth: 20, halign: 'center' },  // Stok Awal
        4: { cellWidth: 20, halign: 'center', fillColor: [220, 220, 220] },  // In
        5: { cellWidth: 20, halign: 'center', fillColor: [220, 220, 220] },  // Out
        6: { cellWidth: 20, halign: 'center' },  // Stok Akhir
        7: { cellWidth: 10, fillColor: [200, 220, 255], halign: 'center' },  // OPR
        8: { cellWidth: 10, fillColor: [200, 220, 255], halign: 'center' },  // UC
        9: { cellWidth: 10, fillColor: [200, 220, 255], halign: 'center' },  // NC
        10: { cellWidth: 10, fillColor: [200, 220, 255], halign: 'center' }, // KKB
        11: { cellWidth: 10, fillColor: [200, 220, 255], halign: 'center' }, // DS
        12: { cellWidth: 10, fillColor: [200, 220, 255], halign: 'center' }  // ASR
      },
      headStyles: {
        fillColor: [51, 122, 183],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      didDrawPage: () => {
        // Tambahkan nomor halaman
        let str = 'Page ' + pdf.getCurrentPageInfo().pageNumber;
        pdf.setFontSize(10);
        pdf.text(str, pageWidth - 20, pageHeight - 10, { align: 'right' });
      }
    } as UserOptions);

    pdf.save(`balancing-report-${this.selectedKategori}-${this.selectedDate}.pdf`);
  }


  getTableData(): RowInput[] {
    return this.reportList.map((item, index) => [
      index + 1,
      item.kodeBarang,
      item.namaBarang,
      item.stokAwal,
      item.barangIn,
      item.barangOut,
      item.stokAhkhir,
      item.opr,
      item.uc,
      item.nc,
      item.kkb,
      item.ds,
      item.asr
    ]);
  }

  onExportToPDF() {
    if (!this.isDataLoaded) {
      this.loadReportWithApprove();
    }
    this.exportToPDF();
  }
  
}




