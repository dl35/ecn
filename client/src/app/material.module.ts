import { NgModule } from '@angular/core';

import {
  MdButtonModule,
  MdMenuModule,
  MdToolbarModule,
  MdIconModule,
  MdCardModule,
  MdTableModule,
  MdSortModule,
  MdDatepickerModule,
  MdSelectModule,
  MdOptionModule,
  MdPaginatorModule,
  MdCheckboxModule,
  MdChipsModule,
  MdInputModule,
  MdSnackBarModule
} from '@angular/material';

@NgModule({
  imports: [
    MdButtonModule,
    MdMenuModule,
    MdToolbarModule,
    MdIconModule,
    MdCardModule,
    MdButtonModule,
    MdTableModule,
    MdSortModule,
    MdDatepickerModule,
    MdSelectModule,
    MdOptionModule,
    MdCheckboxModule,
    MdPaginatorModule,
    MdChipsModule,
    MdInputModule,
    MdSnackBarModule

  ],
  exports: [
    MdButtonModule,
    MdMenuModule,
    MdToolbarModule,
    MdIconModule,
    MdCardModule,
    MdButtonModule,
    MdTableModule,
    MdDatepickerModule,
    MdSelectModule,
    MdOptionModule,
    MdCheckboxModule,
    MdPaginatorModule,
    MdChipsModule,
    MdInputModule,
    MdSnackBarModule
  ]
})
export class MaterialModule {}