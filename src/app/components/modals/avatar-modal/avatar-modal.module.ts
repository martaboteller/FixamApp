import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AvatarModalComponent } from './avatar-modal.component';

@NgModule({
  declarations: [AvatarModalComponent],
  exports: [AvatarModalComponent],
  imports: [CommonModule, IonicModule],
})
export class AvatarModalModule {}
