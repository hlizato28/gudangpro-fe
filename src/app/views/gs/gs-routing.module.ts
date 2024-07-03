import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarangComponent } from './barang/barang.component';
import { ApprovalComponent } from './approval/approval.component';
import { PerComponent } from './setting-cabang/per/per.component';
import { SemuaComponent } from './setting-cabang/semua/semua.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'General Service',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'barang',
      },
      {
        path: 'barang',
        component: BarangComponent,
        data: {
          title: 'Items',
        }
        // children: [
        //   {
        //     path: 'add',
        //     component: AddBarangComponent,
        //     data: {
        //       title: 'Add'
        //     },
        //     resolve: {
        //       title: titleResolver
        //     },
        //     canDeactivate: [unsavedChangeGuard]
        //   }
        // ]
      },
      {
        path: 'cabang',
        data: {
          title: 'Setting Cabang',
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'per',
          },
          {
            path: 'per',
            component: PerComponent,
            data: {
              title: 'Setting Per Cabang'
            }
          },
          {
            path: 'semua',
            component: SemuaComponent,
            data: {
              title: 'Setting Semua Cabang'
            }
          }
        ]
      },
      {
        path: 'approval',
        component: ApprovalComponent,
        data: {
          title: 'Approval Pengajuan'
        }
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GsRoutingModule { }
