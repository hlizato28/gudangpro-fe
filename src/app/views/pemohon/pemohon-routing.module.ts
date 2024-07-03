import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PengajuanComponent } from './pengajuan/pengajuan.component';
import { ApprovalBarangComponent } from './approval-barang/approval-barang.component';

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
        redirectTo: 'pengajuan',
      },
      {
        path: 'pengajuan',
        component: PengajuanComponent,
        data: {
          title: 'Pengajuan',
        }
      },
      {
        path: 'approval-barang',
        component: ApprovalBarangComponent,
        data: {
          title: 'Approval Terima Barang',
        }
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PemohonRoutingModule { }
