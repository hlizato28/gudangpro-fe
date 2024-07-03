import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GsRoutingModule } from './gs-routing.module';
import { BarangComponent } from './barang/barang.component';
import { ApprovalComponent } from './approval/approval.component';

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

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { PerComponent } from './setting-cabang/per/per.component';
import { SemuaComponent } from './setting-cabang/semua/semua.component';


@NgModule({
  declarations: [
    BarangComponent,
    ApprovalComponent,
    PerComponent,
    SemuaComponent
  ],
  imports: [
    CommonModule,
    GsRoutingModule,
    CardModule,
    TableModule,
    GridModule,
    PaginationModule,
    ButtonModule,
    FormModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    ModalModule
  ]
})
export class GsModule { }
