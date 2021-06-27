import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Capture } from 'src/app/interfaces/interfaces';
import { CapturesService } from 'src/app/services/captures/captures.service';
import { AlertController, NavParams, ToastController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users/users.service';

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
  detailForm: FormGroup;

  constructor(
    private captureService: CapturesService,
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
      captureName: new FormControl(null, Validators.required),
      captureNameEditable: new FormControl(null, Validators.required),
      captureDescription: new FormControl(null, Validators.required),
      captureDescriptionEditable: new FormControl(null, Validators.required),
      publicToggle: new FormControl(null, Validators.required),
      publicToggleEditable: new FormControl(null),
    });
  }

  //Show photo
  loadDetailCapture() {
    if (this.captureService.isNewEntry) {
      this.activeCapture = this.captureService.savedCapture;
      this.editable = true;
    } else {
      this.imageUrl = this.route.snapshot.paramMap.get('url');
      this.idCapture = Number(this.route.snapshot.paramMap.get('idCapture'));
      this.activeCapture = this.captureService.filterCaptureById(
        this.idCapture
      );
    }
  }

  getUsername(uid: string): string {
    return this.usersService.filterUserByUid(uid);
  }

  //Update capture
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

  //Save capture
  saveCapture(savedCapture: Capture): void {
    this.captureService.updateCapture(savedCapture).then(() => {
      console.log('Created new item successfully!');
      this.submitted = true;
    });
  }

  //Edit capture
  editCapture() {
    this.editable = true;
  }

  callConfirm(idCapture: number) {
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
              this.deleteCapture(idCapture);
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

  //Delete capture
  deleteCapture(idCapture: number): void {
    const id = idCapture.toString();
    this.captureService.deleteCapture(id);
    this.deleted = true;
    this.captureDeletedToast();
  }

  async captureDeletedToast() {
    const toast = await this.toast.create({
      message: 'Captura eliminada',
      duration: 4000,
    });
    toast.present();
  }

  goToMap(idCapture: number) {
    const mapMarker = this.captureService.filterLocationById(idCapture);
    this.router.navigate(['../../menu/first/map', mapMarker]);
  }

  back() {
    this.router.navigate(['../../menu/first/list']);
  }
}
