import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Capture } from 'src/app/interfaces/interfaces';
import { CapturesService } from 'src/app/services/captures/captures.service';
import { AlertController, NavParams, ToastController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users/users.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  //Variables
  imageUrl: string = '';
  idCapture: number = 0;
  activeCapture: Capture = <Capture>{};
  submitted = false;
  deleted = false;
  editable = false;
  belongsToUser: boolean = false;
  detailForm: FormGroup;
  dislikeChecked: boolean = false;
  activeUsername: string;

  constructor(
    private capturesService: CapturesService,
    private cameraService: CameraService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastController,
    private alertController: AlertController,
    private authService: AuthService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadDetailCapture();
  }

  buildForm(): void {
    this.detailForm = new FormGroup({
      captureNameEditable: new FormControl(
        { value: null },
        Validators.required
      ),
      captureDescriptionEditable: new FormControl(Validators.required),
      publicToggleEditable: new FormControl('', Validators.required),
    });
  }

  //Depending on if newEntry or not show diferent htmlElements
  loadDetailCapture() {
    this.imageUrl = this.route.snapshot.paramMap.get('url');
    this.idCapture = Number(this.route.snapshot.paramMap.get('idCapture'));

    if (!this.capturesService.doesExist(this.idCapture)) {
      this.activeCapture = this.cameraService.savedCapture;
      this.belongsToUser = true;
      this.editable = true;
    } else {
      //Determinate if capture belongs to user
      this.belongsToUser = this.capturesService.belongsToLoggedUser(
        this.idCapture,
        this.authService.getToken()
      );
      this.activeCapture = this.capturesService.filterCaptureById(
        this.idCapture
      );
    }
    this.activeUsername = this.usersService.filterUserByUid(
      this.activeCapture.uid
    );
  }

  /*  getUsername(uid: string): string {
    return this.usersService.filterUserByUid(uid);
  }*/

  //Update capture when 'Save' button is clicked
  saveActiveCapture(): void {
    if (
      this.activeCapture.name === '' ||
      this.activeCapture.description === ''
    ) {
      this.viewAlert(
        this.translateService.instant('detailAlert.error'),
        this.translateService.instant('detailAlert.msg')
      );
    } else {
      const savedCapture: Capture = {
        imageUrl: this.activeCapture.imageUrl,
        idCapture: this.activeCapture.idCapture,
        latitude: this.activeCapture.latitude,
        longitude: this.activeCapture.longitude,
        date: String(new Date()),
        description: this.activeCapture.description,
        name: this.activeCapture.name,
        publicState: this.activeCapture.publicState,
        uid: this.activeCapture.uid,
        votes: this.activeCapture.votes,
        dislikeChecked: this.activeCapture.dislikeChecked,
      };

      this.saveCapture(savedCapture);
      this.router.navigate(['../../menu/first/list']);
    }
  }

  //Save capture at Firebase
  saveCapture(savedCapture: Capture): void {
    if (this.capturesService.updateCapture(savedCapture)) {
      this.submitted = true;
    }
  }

  //Update dislike status
  checkDislike(idCapture: number) {
    if (this.capturesService.doesExist(idCapture)) {
      this.capturesService.checkDislike(idCapture);
      this.loadDetailCapture();
    } else {
      console.log("Can't dislike, capture does not exist");
    }
  }

  //Edit capture when 'Edit' button is clicked (boolean changed)
  editCapture() {
    this.editable = true;
  }

  //Ask for confirmation when 'Delete' button is clicked
  callConfirm(idCapture: number) {
    if (this.capturesService.doesExist(idCapture)) {
      this.alertController
        .create({
          header: '¿Deseas eliminar la captura?',
          subHeader: '',
          message: '',
          buttons: [
            {
              text: 'No',
              handler: () => {
                console.log('Captura no eliminada');
              },
            },
            {
              text: 'Si',
              handler: () => {
                this.deleteCapture(idCapture, this.imageUrl);
                this.back();
                console.log('Captura eliminada');
              },
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    } else {
      console.log('The capture does not exist still');
    }
  }

  //Delete capture at Firebase
  deleteCapture(idCapture: number, imageUrl: string): void {
    //Delete capture
    const id = idCapture.toString();
    this.capturesService.deleteCapture(id);
    this.deleted = true;
    //Delete stored image
    this.cameraService.deleteImage(imageUrl);
    this.captureDeletedToast();
  }

  //If new entry and user does not save delete photo at Firestorage
  deleteCaptureIfNotSaved() {
    console.log('Deleting capture image');
    this.cameraService.deleteImage(this.imageUrl);
  }

  //TO-DO: We can delete this?
  async captureDeletedToast() {
    const toast = await this.toast.create({
      message: 'Captura eliminada',
      duration: 4000,
    });
    toast.present();
  }

  //From detail page to map page (provide mapMarker)
  goToMap(idCapture: number) {
    if (this.capturesService.doesExist(idCapture)) {
      const mapMarker = this.capturesService.filterLocationById(idCapture);
      this.router.navigate([
        '../../menu/first/map',
        mapMarker.idCapture.toString(),
      ]);
    } else {
      console.log("Can't go to map, capture does not exist still");
    }
  }

  back() {
    //If capture has not been saved delete photo
    if (!this.capturesService.doesExist(this.idCapture)) {
      //console.log('Exists? ' + this.capturesService.doesExist(this.idCapture));
      this.deleteCaptureIfNotSaved();
    }
    this.router.navigate(['../../menu/first/list']);
  }

  async viewAlert(header: string, msg: string) {
    const alert = this.alertController.create({
      header: header,
      message: msg,
    });
    (await alert).present();
  }
}
