import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StokItemComponent } from './stok-item/stok-item.component';
import { ApprovePengajuanComponent } from './approve-pengajuan/approve-pengajuan.component';
import { ApproveDetailPengajuanComponent } from './approve-detail-pengajuan/approve-detail-pengajuan.component';
import { BalancingComponent } from './balancing/balancing.component';
import { RevisiComponent } from './revisi/revisi.component';
import { RevisiDetailComponent } from './revisi-detail/revisi-detail.component';
import { RevisiOutComponent } from './revisi-out/revisi-out.component';

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
        data: {
          title: 'Balancing',
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'balancing'
          },
          {
            path: 'balancing',
            component: BalancingComponent,
            data: {
              title: 'Balancing'
            }
          },
          {
            path: 'revisi',
            component: RevisiComponent,
            data: {
              title: 'Revisi Balancing'
            }
          },
          {
            path: 'revisi-detail/:id',
            component: RevisiDetailComponent,
            data: {
              title: 'Revisi Balancing'
            }
          },
          {
            path: 'revisi-out/:id',
            component: RevisiOutComponent,
            data: {
              title: 'Revisi Barang Out'
            }
          }
        ]
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
