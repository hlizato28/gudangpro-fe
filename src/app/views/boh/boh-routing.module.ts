import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppBalancingComponent } from './approval/app-balancing/app-balancing.component';
import { StokComponent } from './approval/stok/stok.component';
import { HistBalancingComponent } from './history/hist-balancing/hist-balancing.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'BOH',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'approval',
      },
      {
        path: 'approval',
        data: {
          title: 'Approval',
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'balancing',
          },
          {
            path: 'balancing',
            component: AppBalancingComponent,
            data: {
              title: 'Approval Balancing'
            }
          },
          {
            path: 'stok',
            component: StokComponent,
            data: {
              title: 'Approval Stok Item'
            }
          }
        ]
      },
      {
        path: 'history',
        data: {
          title: 'History'
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'approval',
          },
          {
            path: 'balancing',
            component: HistBalancingComponent,
            data: {
              title: 'History Balancing'
            }
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BohRoutingModule { }
