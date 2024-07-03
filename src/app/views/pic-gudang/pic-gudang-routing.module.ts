import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StokItemComponent } from './stok-item/stok-item.component';
import { ApprovePengajuanComponent } from './approve-pengajuan/approve-pengajuan.component';
import { ApproveDetailPengajuanComponent } from './approve-detail-pengajuan/approve-detail-pengajuan.component';
import { BalancingComponent } from './balancing/balancing.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'PIC Gudang',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'stok',
      },
      {
        path: 'stok',
        component: StokItemComponent,
        data: {
          title: 'Stok Item',
        }
      },
      {
        path: 'balancing',
        component: BalancingComponent,
        data: {
          title: 'Balancing',
        }
      },
      {
        path: 'approve-pengajuan',
        component: ApprovePengajuanComponent,
        data: {
          title: 'Approve Pengajuan',
        }
      },
      {
        path: 'approve-detail-pengajuan/:id',
        component: ApproveDetailPengajuanComponent,
        data: {
          title: 'Approve Pengajuan',
        }
      },
      // {
      //   path: 'cabang',
      //   data: {
      //     title: 'Setting Cabang',
      //   },
      //   children: [
      //     {
      //       path: '',
      //       pathMatch: 'full',
      //       redirectTo: 'per',
      //     },
      //     {
      //       path: 'per',
      //       component: PerComponent,
      //       data: {
      //         title: 'Setting Per Cabang'
      //       }
      //     },
      //     {
      //       path: 'semua',
      //       component: SemuaComponent,
      //       data: {
      //         title: 'Setting Semua Cabang'
      //       }
      //     }
      //   ]
      // },
      // {
      //   path: 'approval',
      //   component: ApprovalComponent,
      //   data: {
      //     title: 'Approval Pengajuan'
      //   }
      // }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PicGudangRoutingModule { }
