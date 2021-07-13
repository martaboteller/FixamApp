import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-avatar-modal',
  templateUrl: './avatar-modal.component.html',
  styleUrls: ['./avatar-modal.component.scss'],
})
export class AvatarModalComponent {

  constructor(
    private modalControl: ModalController,
    private alertControl: AlertController,
    private userService: UsersService
  ) { }

  dismissModal(){
    this.modalControl.dismiss(null);
  }

  verifyFile(event){
    const image: File = event.target.files[0];

    if(image.type == 'image/jpeg' || image.type == 'image/png'){
      this.uploadAvatar(image);
    }else{
      this.viewAlert();
    }
  }

  async uploadAvatar(image: File){
    await this.userService.uploadAvatar(image).then(
      response => {
        this.modalControl.dismiss(response);
      }
    ).catch(
      error => {
        console.log(error)
      }
    );
  }

  async viewAlert(){
    const alert = this.alertControl.create({
      header: 'Error',
      message: 'Solo se admiten imagenes en formato .jpeg o .png'
    });

    (await alert).present();
  }
}
