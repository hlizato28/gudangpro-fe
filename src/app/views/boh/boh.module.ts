import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// CoreUI Modules
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
  UtilitiesModule
} from '@coreui/angular';

import { BohRoutingModule } from './boh-routing.module';
import { AppBalancingComponent } from './approval/app-balancing/app-balancing.component';
import { StokComponent } from './approval/stok/stok.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { HistBalancingComponent } from './history/hist-balancing/hist-balancing.component';


@NgModule({
  declarations: [
    AppBalancingComponent,
    StokComponent,
    HistBalancingComponent
  ],
  imports: [
    CommonModule,
    BohRoutingModule,
    CardModule,
    TableModule,
    GridModule,
    PaginationModule,
    ButtonModule,
    FormModule,
    FormsModule,
    IconModule,
    ModalModule,
    NavModule,
    TabsModule
  ]
})
export class BohModule { }
