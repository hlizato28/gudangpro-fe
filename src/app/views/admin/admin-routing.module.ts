import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleDataComponent } from './role/role-data/role-data.component';
import { AksesComponent } from './role/akses/akses.component';
import { UnitDataComponent } from './unit/unit-data/unit-data.component';
import { UnitGroupComponent } from './unit/unit-group/unit-group.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Administrator',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'user',
      },
      {
        path: 'user',
        component: UserComponent,
        data: {
          title: 'User'
        }
      },
      {
        path: 'role',
        data: {
          title: 'Role',
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'data',
          },
          {
            path: 'data',
            component: RoleDataComponent,
            data: {
              title: 'Data'
            }
          },
          {
            path: 'akses',
            component: AksesComponent,
            data: {
              title: 'Akses'
            }
          }
        ]
      },
      {
        path: 'unit',
        data: {
          title: 'Unit',
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'data',
          },
          {
            path: 'data',
            component: UnitDataComponent,
            data: {
              title: 'Data'
            }
          },
          {
            path: 'group',
            component: UnitGroupComponent,
            data: {
              title: 'Group'
            }
          }
        ]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
