import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { IUser } from 'src/app/interfaces/admin/user/i-user'
import { ITabPane } from 'src/app/interfaces/i-tab-pane';
import { ArrayDataResponse } from 'src/app/interfaces/responses/array-data-response';
import { ListDataResponse } from 'src/app/interfaces/responses/list-data-response';
import { RoleDataService } from 'src/app/services/admin/role/role-data.service'
import { UserService } from 'src/app/services/admin/user.service'
import Swal from 'sweetalert2';
import { User } from 'src/app/models/admin/user'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit{
  roleList: string[] = [];
  userList: IUser[] = [];
  visiblePages: number[] = [];
  selectedRole: string = '';
  isApproved: boolean = false;
  selectAll: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  panes: ITabPane[] = [
    { name: 'Need Approval', id: 'tab-need-approval'},
    { name: 'User Data', id: 'tab-user-data'}
  ];

  activeTabPaneIdx: number = 0;

  constructor(
    private roleDataService: RoleDataService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.loadRole();
    this.loadUser();    
  }

  loadRole(): void {
    this.roleDataService.getRoleList().subscribe({
      next: (response: ArrayDataResponse) => {
        this.roleList = response.data;
      },
      error: (error) => {
        console.error('Gagal memuat data role:', error);
      }
    });
  }

  loadUser(): void {
    const params = new HttpParams()
      .set('role', this.selectedRole)
      .set('searchTerm', this.searchTerm)
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());
  
    const activeTabPane = this.panes[this.activeTabPaneIdx];
    if (activeTabPane.id === 'tab-user-data') {
      this.isApproved = true;
    } else if (activeTabPane.id === 'tab-need-approval') {
      this.isApproved = false;
      this.selectedRole = '';
    } else {
      console.error('Tab tidak valid.');
      return;
    }

    this.userService.getUserList(this.selectedRole, this.isApproved, this.searchTerm, this.currentPage - 1, this.pageSize).subscribe({
      next: (response: ListDataResponse<IUser>) => {
        this.userList = response.content;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.updateVisiblePages();
      },
      error: (error) => {
        console.error('Gagal memuat data user:', error);
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
    this.loadUser();
  }

  toggleSelectAll() {
    this.userList.forEach(user => user.selected = this.selectAll);
  }

  onSearch(): void {
    this.loadUser();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
    this.loadUser();
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

  deleteUserSatuan(user: IUser): void {
    Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin menghapus user "${user.userName} - ${user.nama}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        if (user.idUser) {
          this.deleteUser(user.idUser);
        }
      }
    });
  }

  deleteSelectedUser(): void {
    const selectedUser = this.userList.filter(user => user.selected);
  
    if (selectedUser.length === 0) {
      Swal.fire({
        title: 'Peringatan',
        text: 'Anda belum memilih user yang akan dihapus.',
        icon: 'warning',
      });
      return;
    }
  
    Swal.fire({
      title: 'Konfirmasi',
      text: 'Apakah Anda yakin ingin menghapus user yang dipilih?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        selectedUser.forEach(user => {
          if (user.idUser) {
            this.deleteUser(user.idUser);
          }
        });
      }
    });
  }

  deleteUser(idUser: number): void {
    this.userService.deleteUser(idUser).subscribe({
      next: () => {
        this.userList = this.userList.filter(user => user.idUser !== idUser);
        
        Swal.fire({
          title: 'Sukses',
          text: 'User berhasil dihapus.',
          icon: 'success',
        });
        this.loadUser();
      },
      error: (error) => {
        console.error('Gagal menghapus user:', error);
        
        Swal.fire({
          title: 'Error',
          text: 'Terjadi kesalahan saat menghapus user.',
          icon: 'error',
        });
      }
    });
  }

  // START OF UPDATE

  selectedUser: IUser = new User();
  editedUser: Record<number, IUser> = {}; // Variabel untuk menyimpan data yang diedit di modal
  showEditModal: boolean = false;
  role: string = '';

  approve(user: IUser): void {
    if (user.role) {
      this.userService.approve(user).subscribe({
        next: () => {
          Swal.fire({
            title: 'Sukses',
            text: 'User berhasil diperbarui.',
            icon: 'success',
          }).then(() => {
            this.loadUser();
          });
        },
        error: (error) => {
          console.error('Error updating user:', error);
          let errorMessage = 'Terjadi kesalahan saat memperbarui user.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Role user belum dipilih.',
        icon: 'error',
      });
    }
  }

  bulkApprove(): void {
  const selectedUsers = this.userList.filter(user => user.selected);

  if (selectedUsers.length === 0) {
    Swal.fire({
      title: 'Info',
      text: 'Tidak ada user yang dipilih.',
      icon: 'info',
    });
    return;
  }

  const userNotApproved = selectedUsers.filter(user => !user.role);

  if (userNotApproved.length > 0) {
    const userNames = userNotApproved.map(user => user.userName).join(', ');
    Swal.fire({
      title: 'Error',
      text: `Role dari user (${userNames}) belum dipilih.`,
      icon: 'error',
    });
    return;
  }

  const observables = selectedUsers.map(user => {
    const { selected, ...userWithoutSelected } = user;
    return this.userService.approve(userWithoutSelected);
  });

  forkJoin(observables)
    .subscribe({
      next: () => {
        Swal.fire({
          title: 'Sukses',
          text: 'User berhasil diperbarui.',
          icon: 'success',
        }).then(() => {
          this.loadUser();
        });
      },
      error: (error) => {
        console.error('Error updating users:', error);
        let errorMessage = 'Terjadi kesalahan saat memperbarui user.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
        });
      }
    });
  }

  editUser(user: IUser): void {
    if (!this.editedUser[user.idUser!]) {
      this.editedUser[user.idUser!] = { ...user };
    }

    this.selectedUser = { ...this.editedUser[user.idUser!] };
    this.role = this.selectedUser.role;
    this.showEditModal = true;
  }

  cancelEdit(): void {
    this.showEditModal = false;
  }

  onSubmitEdit(): void {
    if (this.selectedUser) {
      this.userService.editUser(this.selectedUser).subscribe({
        next: () => {
          Swal.fire({
            title: 'Sukses',
            text: 'User berhasil diperbarui.',
            icon: 'success',
          }).then(() => {
            this.editedUser = {};
            this.showEditModal = false;
            this.loadUser();
          });
        },
        error: (error) => {
          console.error('Error updating user:', error);
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
    if (this.selectedUser) {
      this.selectedUser.role = this.role
      this.editedUser[this.selectedUser.idUser!] = { ...this.selectedUser };
    }
  }

  // START OF CREATE

  newUser: User = new User();
  addedUser: Record<number, User> = {}; // Variabel untuk menyimpan data yang ditambahkan di modal
  showAddModal: boolean = false;

  addUser(): void {
    if (this.addedUser[0]) {
      this.newUser = { ...this.addedUser[0] };
    } else {
      this.newUser = new User();
    }

    this.showAddModal = true;
  }

  onAddFormChange(): void {
    this.addedUser[0] = { ...this.newUser };
  }

  onSubmitAdd(): void {
    this.userService.createUser(this.newUser).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Sukses',
          text: 'User berhasil ditambahkan.',
          icon: 'success'
        }).then(() => {
          delete this.addedUser[0];
          this.showAddModal = false;
          this.loadUser();
        });
      },
      error: (error) => {
        console.error('Gagal menambahkan user:', error);
        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error'
        });
      }
    });
  }

  cancelAddUser(): void {
    this.showAddModal = false;
  }

}
