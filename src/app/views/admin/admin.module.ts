import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AksesComponent } from './role/akses/akses.component';
import { UnitDataComponent } from './unit/unit-data/unit-data.component';
import { RoleDataComponent } from './role/role-data/role-data.component';
import { UnitGroupComponent } from './unit/unit-group/unit-group.component';

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
import { FormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { UserComponent } from './user/user.component';


@NgModule({
  declarations: [
    AksesComponent,
    UnitDataComponent,
    RoleDataComponent,
    UnitGroupComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CardModule,
    GridModule,
    NavModule,
    TabsModule,
    TableModule,
    FormModule,
    PaginationModule,
    FormsModule,
    IconModule,
    ButtonModule,
    ModalModule
  ]
})
export class AdminModule { }
