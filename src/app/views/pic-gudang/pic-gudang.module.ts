import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  AccordionModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  CollapseModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  ModalComponent,
  ModalHeaderComponent,
  ModalModule,
  NavModule,
  PaginationModule,
  PlaceholderModule,
  PopoverModule,
  ProgressModule,
  SharedModule,
  SpinnerModule,
  TableModule,
  TabsModule,
  TooltipModule,
  UtilitiesModule,
} from '@coreui/angular';

import { PicGudangRoutingModule } from './pic-gudang-routing.module';
import { StokItemComponent } from './stok-item/stok-item.component';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';
import { ApprovePengajuanComponent } from './approve-pengajuan/approve-pengajuan.component';
import { ApproveDetailPengajuanComponent } from './approve-detail-pengajuan/approve-detail-pengajuan.component';
import { RouterModule } from '@angular/router';
import { BalancingComponent } from './balancing/balancing.component';


@NgModule({
  declarations: [
    StokItemComponent,
    ApprovePengajuanComponent,
    ApproveDetailPengajuanComponent,
    BalancingComponent
  ],
  imports: [
    CommonModule,
    PicGudangRoutingModule,
    CardModule,
    TableModule,
    GridModule,
    PaginationModule,
    ButtonModule,
    IconModule,
    FormModule,
    FormsModule,
    ModalModule,
    AccordionModule,
    ListGroupModule,
    RouterModule
  ]
})
export class PicGudangModule { }
