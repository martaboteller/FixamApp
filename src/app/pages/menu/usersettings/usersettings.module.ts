import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersettingsPageRoutingModule } from './usersettings-routing.module';

import { UsersettingsPage } from './usersettings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UsersettingsPageRoutingModule
  ],
  declarations: [UsersettingsPage]
})
export class UsersettingsPageModule {}
