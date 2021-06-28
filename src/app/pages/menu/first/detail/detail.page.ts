import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Capture } from 'src/app/interfaces/interfaces';
import { CapturesService } from 'src/app/services/captures/captures.service';
import { AlertController, NavParams, ToastController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users/users.service';
import { CameraService } from 'src/app/services/camera/camera.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  //Variables
  imageUrl: string;
  idCapture: number;
  activeCapture: Capture;
  submitted = false;
  deleted = false;
  editable = false;
  isNewEntry: boolean;
  detailForm: FormGroup;
  dislikeChecked: boolean = false;

  constructor(
    private capturesService: CapturesService,
    private cameraService: CameraService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastController,
    private alertController: AlertController
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

    if (this.isNewEntry) {
      this.activeCapture = this.cameraService.savedCapture;
      this.editable = true;
      console.log('What is the public state ' + this.activeCapture.publicState);
    } else {
      this.activeCapture = this.capturesService.filterCaptureById(
        this.idCapture
      );
    }
  }

  getUsername(uid: string): string {
    return this.usersService.filterUserByUid(uid);
  }

  //Update capture when 'Save' button is clicked
  saveActiveCapture(): void {
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
    this.back();
  }

  //Save capture at Firebase
  saveCapture(savedCapture: Capture): void {
    this.capturesService.updateCapture(savedCapture).then(() => {
      this.submitted = true;
    });
  }

  //Update dislike status
  checkDislike(idCapture: number) {
    if (
      this.capturesService.filterCaptureById(this.activeCapture.idCapture) !=
      null
    ) {
      this.capturesService.checkDislike(idCapture);
    }
  }

  //Edit capture when 'Edit' button is clicked (boolean changed)
  editCapture() {
    this.editable = true;
  }

  //Ask for confirmation when 'Delete' button is clicked
  callConfirm(idCapture: number) {
    if (
      this.capturesService.filterCaptureById(this.activeCapture.idCapture) !=
      null
    ) {
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
    if (
      this.capturesService.filterCaptureById(this.activeCapture.idCapture) !=
      null
    ) {
      const mapMarker = this.capturesService.filterLocationById(idCapture);
      this.router.navigate([
        '../../menu/first/map',
        mapMarker.idCapture.toString(),
      ]);
    }
  }

  back() {
    //If capture has not been saved delete photo
    if (
      this.capturesService.filterCaptureById(this.activeCapture.idCapture) ==
      null
    ) {
      this.deleteCaptureIfNotSaved();
    }
    this.isNewEntry = false;
    this.router.navigate(['../../menu/first/list']);
  }
}
