import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-avatar-modal',
  templateUrl: './avatar-modal.component.html',
  styleUrls: ['./avatar-modal.component.scss'],
})
export class AvatarModalComponent {
  //Variables
  public imageFile: File;
  public modalTitle = this.translateService.instant('avatarModal.select');
  public uploadButton = this.translateService.instant(
    'avatarModal.uploadButton'
  );
  public closeButton = this.translateService.instant('avatarModal.closeButton');

  constructor(
    private modalControl: ModalController,
    private alertControl: AlertController,
    private userService: UsersService,
    private translateService: TranslateService
  ) {}

  dismissModal() {
    this.modalControl.dismiss(null);
  }

  //Retrive imageFile when input selected
  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
    }
  }

  //Verify if imageFile has correct format if necessary show alert
  verifyFile(event) {
    try {
      if (
        this.imageFile.type == 'image/jpeg' ||
        this.imageFile.type == 'image/png'
      ) {
        this.uploadAvatar(this.imageFile);
      } else {
        this.viewAlert(
          this.translateService.instant('avatarModal.errorMsg'),
          this.translateService.instant('avatarModal.errorType')
        );
      }
    } catch {
      this.viewAlert(
        this.translateService.instant('avatarModal.errorMsg'),
        this.translateService.instant('avatarModal.errorNotSelected')
      );
    }
  }

  //Upload avatar using userService
  async uploadAvatar(image: File) {
    await this.userService
      .uploadAvatar(image)
      .then((response) => {
        this.modalControl.dismiss(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Generic alert
  async viewAlert(header: string, msg: string) {
    const alert = this.alertControl.create({
      header: header,
      message: msg,
    });
    (await alert).present();
  }
}
