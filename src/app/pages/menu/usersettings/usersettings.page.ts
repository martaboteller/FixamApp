import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { AvatarModalComponent } from 'src/app/components/modals/avatar-modal/avatar-modal.component';
import { User } from 'src/app/interfaces/interfaces';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-usersettings',
  templateUrl: './usersettings.page.html',
  styleUrls: ['./usersettings.page.scss'],
})
export class UsersettingsPage implements OnInit {
  user: User = {} as User;
  updateForm: FormGroup;
  isADesktop: boolean = false;

  constructor(
    private userService: UsersService,
    private modalControl: ModalController,
    private toast: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.getUserLogged();
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.updateForm = this.formBuilder.group({
      name: new FormControl(),
      surname: new FormControl(),
      username: new FormControl(),
    });
  }

  isDesktopWide(): boolean {
    if (window.innerWidth > 1000) {
      this.isADesktop = true;
      //console.log('I am in a desktop!');
    }
    return this.isADesktop;
  }

  updateUser() {
    if (this.updateForm.valid) {
      this.user.name = this.updateForm.get('name').value;
      this.user.surname = this.updateForm.get('surname').value;
      this.user.username = this.updateForm.get('username').value;

      this.userService
        .updateUser(this.user)
        .then((response) => {
          this.presentToast(response);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const message = 'Formulario incompleto';
      this.presentToast(message);
    }
  }

  saveAvatarData() {
    this.userService
      .updateUser(this.user)
      .then((response) => {
        this.presentToast(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getUserLogged() {
    this.userService.getUserLogged().subscribe(
      (response) => {
        this.user.name = response.name;
        this.user.surname = response.surname;
        this.user.username = response.username;
        this.user.uid = response.uid;
        this.user.email = response.email;
        this.user.avatarFilename = response.avatarFilename;
        this.user.avatarURL = response.avatarURL;

        this.userService.sendUserData(this.user);

        this.updateForm = this.formBuilder.group({
          name: [this.user.name, [Validators.required]],
          surname: [this.user.surname, [Validators.required]],
          username: [this.user.username, [Validators.required]],
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async openModal() {
    const modal = this.modalControl.create({
      component: AvatarModalComponent,
      cssClass: 'my-custom-modal-css',
    });

    await (await modal).present();

    const avatar = await (await modal).onWillDismiss();

    if (avatar.data) {
      this.userService.deleteAvatar(this.user).subscribe(
        (response) => {
          this.user.avatarFilename = avatar.data.filename;
          this.user.avatarURL = avatar.data.imageURL;
          const changeAvatar = true;
          this.saveAvatarData();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  async presentToast(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 4000,
    });
    toast.present();
  }
}
