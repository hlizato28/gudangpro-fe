import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUnitData } from 'src/app/interfaces/admin/unit/i-unit-data'
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { UnitDataService } from 'src/app/services/admin/unit/unit-data.service'
import { UnitGroupService } from 'src/app/services/admin/unit/unit-group.service'
import { ITabPane } from 'src/app/interfaces/i-tab-pane'
import { Observable, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { UnitData } from 'src/app/models/admin/unit/unit-data'


@Component({
  selector: 'app-unit-data',
  templateUrl: './unit-data.component.html',
  styleUrls: ['./unit-data.component.scss']
})
export class UnitDataComponent implements OnInit {
  unitGroupList: string[] = [];
  unitList: IUnitData[] = [];
  visiblePages: number[] = [];
  selectedUnitGroup: string = '';
  isUnitGroup: boolean = false;
  selectAll: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  panes: ITabPane[] = [
    { name: 'Without Group', id: 'tab-no-group'},
    { name: 'With Group', id: 'tab-with-group'}
  ];

  activeTabPaneIdx: number = 0;

  constructor(
    private unitDataService: UnitDataService,
    private unitGroupService: UnitGroupService) { }

  ngOnInit(): void {
    this.loadUnitGroup();
    this.loadUnit();
  }

  loadUnitGroup(): void {
    this.unitGroupService.getGroupList().subscribe({
      next: (response: ArrayDataResponse) => {
        this.unitGroupList = response.data;
      },
      error: (error) => {
        console.error('Gagal memuat data group:', error);
      }
    });
  }

  loadUnit(): void {
    const params = new HttpParams()
      .set('group', this.selectedUnitGroup)
      .set('searchTerm', this.searchTerm)
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());
  
    const activeTabPane = this.panes[this.activeTabPaneIdx];
    if (activeTabPane.id === 'tab-with-group') {
      this.isUnitGroup = true;
    } else if (activeTabPane.id === 'tab-no-group') {
      this.isUnitGroup = false;
      this.selectedUnitGroup = '';
    } else {
      console.error('Tab tidak valid.');
      return;
    }

    this.unitDataService.getUnitList(this.isUnitGroup, this.selectedUnitGroup, this.searchTerm, this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IUnitData>) => {
        this.unitList = response.content;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.updateVisiblePages();
      },
      error: (error) => {
        console.error('Gagal memuat data unit:', error);
        Swal.fire({
          title: 'Error',
          text: error.errorMessage,
          icon: 'error',
        });
      }
    });
  }

  onTabChange(tabPaneIdx: number): void {
    this.activeTabPaneIdx = tabPaneIdx;
    this.loadUnit();
  }

  toggleSelectAll() {
    this.unitList.forEach(unit => unit.selected = this.selectAll);
  }

  onSearch(): void {
    this.loadUnit();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
    this.loadUnit();
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

  deleteUnitSatuan(unit: IUnitData): void {
    Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin menghapus unit "${unit.namaUnit}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        if (unit.idUnit) {
          this.deleteUnit(unit.idUnit);
        }
      }
    });
  }

  deleteSelectedUnit(): void {
    const selectedUnit = this.unitList.filter(unit => unit.selected);
  
    if (selectedUnit.length === 0) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Anda belum memilih unit yang akan dihapus.',
        icon: 'warning',
      });
      return;
    }
  
    Swal.fire({
      title: 'Konfirmasi',
      text: 'Apakah Anda yakin ingin menghapus unit yang dipilih?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        selectedUnit.forEach(unit => {
          if (unit.idUnit) {
            this.deleteUnit(unit.idUnit);
          }
        });
      }
    });
  }

  deleteUnit(idUnit: number): void {
    this.unitDataService.deleteUnit(idUnit).subscribe({
      next: () => {
        this.unitList = this.unitList.filter(unit => unit.idUnit !== idUnit);
        
        Swal.fire({
          title: 'Sukses',
          text: 'Unit berhasil dihapus.',
          icon: 'success',
        });
        this.loadUnit();
      },
      error: (error) => {
        console.error('Gagal menghapus unit:', error);
        
        Swal.fire({
          title: 'Error',
          text: 'Terjadi kesalahan saat menghapus unit.',
          icon: 'error',
        });
      }
    });
  }

  // START OF UPDATE

  selectedUnit: IUnitData = new UnitData();
  editedUnit: Record<number, IUnitData> = {}; // Variabel untuk menyimpan data yang diedit di modal
  showEditModal: boolean = false;
  unitGroup: string = '';

  assignGroup(unit: IUnitData): void {
    if (unit.unitGroup) {
      this.unitDataService.assignGroup(unit).subscribe({
        next: () => {
          Swal.fire({
            title: 'Sukses',
            text: 'Unit berhasil diperbarui.',
            icon: 'success',
          }).then(() => {
            this.loadUnit();
          });
        },
        error: (error) => {
          console.error('Error updating unit:', error);
          Swal.fire({
            title: 'Error',
            text: error.error.message,
            icon: 'error',
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Unit group belum dipilih.',
        icon: 'error',
      });
    }
  }

  bulkAssignGroup(): void {
    const selectedUnits = this.unitList.filter(unit => unit.selected);
  
    if (selectedUnits.length === 0) {
      Swal.fire({
        title: 'Info',
        text: 'Tidak ada unit yang dipilih.',
        icon: 'info',
      });
      return;
    }
  
    const unitsWithoutGroup = selectedUnits.filter(unit => !unit.unitGroup);
  
    if (unitsWithoutGroup.length > 0) {
      const unitNames = unitsWithoutGroup.map(unit => unit.namaUnit).join(', ');
      Swal.fire({
        title: 'Error',
        text: `Unit group dari unit (${unitNames}) belum dipilih.`,
        icon: 'error',
      });
      return;
    }
  
    const observables = selectedUnits.map(unit => {
      const { selected, ...unitWithoutSelected } = unit;
      return this.unitDataService.assignGroup(unitWithoutSelected);
    });
  
    forkJoin(observables)
      .subscribe({
        next: () => {
          Swal.fire({
            title: 'Sukses',
            text: 'Unit berhasil diperbarui.',
            icon: 'success',
          }).then(() => {
            this.loadUnit();
          });
        },
        error: (error) => {
          console.error('Error updating units:', error);
          Swal.fire({
            title: 'Error',
            text: error.error.message,
            icon: 'error',
          });
        }
      });
  }

  editUnit(unit: IUnitData): void {
    if (!this.editedUnit[unit.idUnit!]) {
      this.editedUnit[unit.idUnit!] = { ...unit };
    }

    this.selectedUnit = { ...this.editedUnit[unit.idUnit!] };
    this.unitGroup = this.selectedUnit.unitGroup;
    this.showEditModal = true;
  }

  cancelEdit(): void {
    this.showEditModal = false;
  }

  onSubmitEdit(): void {
    if (this.selectedUnit) {
      this.unitDataService.editUnit(this.selectedUnit).subscribe({
        next: () => {
          Swal.fire({
            title: 'Sukses',
            text: 'Unit berhasil diperbarui.',
            icon: 'success',
          }).then(() => {
            this.editedUnit = {};
            this.showEditModal = false;
            this.loadUnit();
          });
        },
        error: (error) => {
          console.error('Error updating unit:', error);
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
    if (this.selectedUnit) {
      this.selectedUnit.unitGroup = this.unitGroup
      this.editedUnit[this.selectedUnit.idUnit!] = { ...this.selectedUnit };
    }
  }

  // START OF CREATE

  newUnit: UnitData = new UnitData();
  addedUnit: Record<number, UnitData> = {}; // Variabel untuk menyimpan data yang ditambahkan di modal
  showAddModal: boolean = false;

  addUnit(): void {
    if (this.addedUnit[0]) {
      this.newUnit = { ...this.addedUnit[0] };
    } else {
      this.newUnit = new UnitData();
    }

    this.showAddModal = true;
  }

  onAddFormChange(): void {
    this.addedUnit[0] = { ...this.newUnit };
  }

  onSubmitAdd(): void {
    this.unitDataService.createUnit(this.newUnit).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Sukses',
          text: 'Unit berhasil ditambahkan.',
          icon: 'success'
        }).then(() => {
          delete this.addedUnit[0];
          this.showAddModal = false;
          this.loadUnit();
        });
      },
      error: (error) => {
        console.error('Gagal menambahkan unit:', error);
        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error'
        });
      }
    });
  }

  cancelAddUnit(): void {
    this.showAddModal = false;
  }

}