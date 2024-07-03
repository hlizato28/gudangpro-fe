import { group } from '@angular/animations';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IUnitGroup } from 'src/app/interfaces/admin/unit/i-unit-group';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { UnitGroupService } from 'src/app/services/admin/unit/unit-group.service';
import Swal from 'sweetalert2';
import { UnitGroup } from 'src/app/models/admin/unit/unit-group';

@Component({
  selector: 'app-unit-group',
  templateUrl: './unit-group.component.html',
  styleUrls: ['./unit-group.component.scss']
})
export class UnitGroupComponent implements OnInit{
  unitGroupList: IUnitGroup[] = [];
  visiblePages: number[] = [];
  selectAll: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private unitGroupService: UnitGroupService) { }

  ngOnInit(): void {
    this.loadGroup();
  }

  loadGroup(): void {
    const params = new HttpParams()
    .set('searchTerm', this.searchTerm)
    .set('page', this.currentPage.toString())
    .set('size', this.pageSize.toString());

    this.unitGroupService.getAllGroup(this.searchTerm, this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IUnitGroup>) => {
          this.unitGroupList = response.content;
          this.totalItems = response.totalElements;
          this.totalPages = response.totalPages;
          this.updateVisiblePages();
        },
        error: (error) => {
          console.error('Gagal memuat data unit group:', error);
        }
      });
  }

  onSearch(): void {
    this.loadGroup();
  }

  toggleSelectAll() {
    this.unitGroupList.forEach(group => group.selected = this.selectAll);
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
    this.loadGroup();
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

  deleteGroupSatuan(unitGroup: IUnitGroup): void {
    Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin menghapus unit group "${unitGroup.namaUnitGroup}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        if (unitGroup.idUnitGroup) {
          this.deleteGroup(unitGroup.idUnitGroup);
        }
      }
    });
  }

  deleteSelectedGroup(): void {
    const selectedGroup = this.unitGroupList.filter(group => group.selected);
  
    if (selectedGroup.length === 0) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Anda belum memilih unit group yang akan dihapus.',
        icon: 'warning',
      });
      return;
    }
  
    Swal.fire({
      title: 'Konfirmasi',
      text: 'Apakah Anda yakin ingin menghapus unit group yang dipilih?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        selectedGroup.forEach(group => {
          if (group.idUnitGroup) {
            this.deleteGroup(group.idUnitGroup);
          }
        });
      }
    });
  }

  deleteGroup(idUnitGroup: number): void {
    this.unitGroupService.deleteGroup(idUnitGroup).subscribe({
      next: () => {
        this.unitGroupList = this.unitGroupList.filter(group => group.idUnitGroup !== idUnitGroup);
        
        Swal.fire({
          title: 'Sukses',
          text: 'Unit Group berhasil dihapus.',
          icon: 'success',
        });
        this.loadGroup();
      },
      error: (error) => {
        console.error('Gagal menghapus Unit Group:', error);
        
        Swal.fire({
          title: 'Error',
          text: 'Terjadi kesalahan saat menghapus Unit Group.',
          icon: 'error',
        });
      }
    });
  }

  // START OF UPDATE

  selectedUnitGroup: IUnitGroup = new UnitGroup();
  editedUnitGroup: Record<number, IUnitGroup> = {}; // Variabel untuk menyimpan data yang diedit di modal
  showEditModal: boolean = false;

  editGroup(group: IUnitGroup): void {
    if (!this.editedUnitGroup[group.idUnitGroup!]) {
      this.editedUnitGroup[group.idUnitGroup!] = { ...group };
    }

    this.selectedUnitGroup = { ...this.editedUnitGroup[group.idUnitGroup!] };
    this.showEditModal = true;
  }

  cancelEdit(): void {
    this.showEditModal = false;
  }

  onSubmitEdit(): void {
    if (this.selectedUnitGroup) {
      this.unitGroupService.editGroup(this.selectedUnitGroup).subscribe({
        next: () => {
          Swal.fire({
            title: 'Sukses',
            text: 'Unit Group berhasil diperbarui.',
            icon: 'success',
          }).then(() => {
            this.editedUnitGroup = {};
            this.showEditModal = false;
            this.loadGroup();
          });
        },
        error: (error) => {
          console.error('Error updating Unit Grouop:', error);
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
    if (this.selectedUnitGroup) {
      this.editedUnitGroup[this.selectedUnitGroup.idUnitGroup!] = { ...this.selectedUnitGroup };
    }
  }

   // START OF CREATE

   newUnitGroup: UnitGroup = new UnitGroup();
   addedUnitGroup: Record<number, UnitGroup> = {}; // Variabel untuk menyimpan data yang ditambahkan di modal
   showAddModal: boolean = false;
 
   addGroup(): void {
     if (this.addedUnitGroup[0]) {
       this.newUnitGroup = { ...this.addedUnitGroup[0] };
     } else {
       this.newUnitGroup = new UnitGroup();
     }
 
     this.showAddModal = true;
   }
 
   onAddFormChange(): void {
     this.addedUnitGroup[0] = { ...this.newUnitGroup };
   }
 
   onSubmitAdd(): void {
     this.unitGroupService.createGroup(this.newUnitGroup).subscribe({
       next: (response) => {
         Swal.fire({
           title: 'Sukses',
           text: 'Unit Group berhasil ditambahkan.',
           icon: 'success'
         }).then(() => {
           delete this.addedUnitGroup[0];
           this.showAddModal = false;
           this.loadGroup();
         });
       },
       error: (error) => {
         console.error('Gagal menambahkan Unit Group:', error);
         Swal.fire({
           title: 'Error',
           text: error.error.message,
           icon: 'error'
         });
       }
     });
   }
 
   cancelAddGroup(): void {
     this.showAddModal = false;
   }


}
