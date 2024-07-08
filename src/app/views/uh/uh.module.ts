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

import { UhRoutingModule } from './uh-routing.module';
import { ApprovalComponent } from './approval/approval.component';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DetailApprovalComponent } from './detail-approval/detail-approval.component';


@NgModule({
  declarations: [
    ApprovalComponent,
    DetailApprovalComponent
  ],
  imports: [
    CommonModule,
    UhRoutingModule,
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
export class UhModule { }
