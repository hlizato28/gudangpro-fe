import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { IUser } from 'src/app/interfaces/admin/user/i-user';
import { GenericDataResponse } from 'src/app/interfaces/responses/generic-data-response';
import { User } from 'src/app/models/admin/user';
import { UserService } from 'src/app/services/admin/user.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  currentUser: User = new User;

  constructor(
    private classToggler: ClassToggleService, 
    private router: Router,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit() {
    this.loadCurrentUser();
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

  logout() {
    localStorage.removeItem('KEYTOKEN');
    this.router.navigate(['/login']);
  }
}
