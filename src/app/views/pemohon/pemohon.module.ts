import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PemohonRoutingModule } from './pemohon-routing.module';
import { PengajuanComponent } from './pengajuan/pengajuan.component';
import { ApprovalBarangComponent } from './approval-barang/approval-barang.component';
import { FormsModule } from '@angular/forms';
import { BadgeModule, ButtonModule, CardModule, FormModule, GridModule, ModalModule, PaginationModule, SpinnerModule, TableModule } from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { cilPlus } from '@coreui/icons';


@NgModule({
  declarations: [
    PengajuanComponent,
    ApprovalBarangComponent
  ],
  imports: [
    CommonModule,
    PemohonRoutingModule,
    FormsModule,
    FormModule,
    GridModule,
    TableModule,
    CardModule,
    PaginationModule,
    ModalModule,
    IconModule,
    ButtonModule, 
    SpinnerModule
  ],
  providers: [IconSetService]
})
export class PemohonModule {
  constructor(public iconSet: IconSetService) {
    iconSet.icons = { cilPlus };
  }
}
