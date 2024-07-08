import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalComponent } from './approval/approval.component'
import { DetailApprovalComponent } from './detail-approval/detail-approval.component'

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
      redirectTo: 'approve-uh',
    },
    {
      path: 'approve-uh',
      component: ApprovalComponent,
      data: {
        title: 'Approval Pengajuan',
      }
    },
    {
      path: 'approve-detail-uh/:id',
      component: DetailApprovalComponent,
      data: {
        title: 'Approve Pengajuan',
      }
    },
  ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UhRoutingModule { }
