import { Injectable, OnInit } from '@angular/core';
import { Capture, MapMarker } from 'src/app/interfaces/interfaces';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { map } from 'rxjs/operators';
import { GeolocationService } from '../geolocation/geolocation.service';

@Injectable({
  providedIn: 'root',
})
export class CapturesService implements OnInit {
  //Variables
  savedCapture: Capture;
  isNewEntry: boolean = false;
  capturesFromFirebase: Capture[];
  capturesRef: AngularFirestoreCollection<Capture>;
  listOfCoordinates: MapMarker[] = [];

  constructor(
    private storage: AngularFireStorage,
    private authService: AuthService,
    private angularFirestore: AngularFirestore,
    private geolocationService: GeolocationService
  ) {}

  ngOnInit() {
    this.getCapturesFromFirebase();
  }

  //Get all captures from Firebase
  getCapturesFromFirebase(): AngularFirestoreCollection<Capture> {
    this.capturesRef = this.angularFirestore.collection('captures');
    this.saveCapturesToArray();
    return this.capturesRef;
  }

  saveCapturesToArray(): void {
    this.capturesRef
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe((data) => {
        this.capturesFromFirebase = data;
      });
  }

  //Get all locations
  getAllLocations(): MapMarker[] {
    for (let i = 0; i < this.capturesFromFirebase.length; i++) {
      this.listOfCoordinates.push({
        position: {
          lat: Number(this.capturesFromFirebase[i].latitude),
          lng: Number(this.capturesFromFirebase[i].longitude),
        },
        votes: this.capturesFromFirebase[i].votes,
        idCapture: this.capturesFromFirebase[i].idCapture,
      });
    }
    return this.listOfCoordinates;
  }

  //Select one capture from array of captures
  filterCaptureById(idCapture: number): Capture {
    return this.capturesFromFirebase.filter(
      (capture) => capture.idCapture === +idCapture
    )[0];
  }

  //Select one location from array of locations
  filterLocationById(idCapture: number): MapMarker {
    return this.listOfCoordinates.filter(
      (mapMarker) => mapMarker.idCapture === +idCapture
    )[0];
  }

  //Save a new capture document to Firebase
  updateCapture(capture: Capture): any {
    return this.capturesRef
      .doc(capture.idCapture.toString())
      .set({ ...capture });
  }

  //Update capture from Firebase
  /*updateCapture(idCapture: string, data: any): Promise<void> {
    return this.capturesRef.doc(idCapture).update(data);
  }*/

  //Delete a capture from Firebase
  deleteCapture(idCapture: string): Promise<void> {
    return this.capturesRef.doc(idCapture).delete();
  }

  //Take a photo with the camera and save it at Firebase
  async takePhoto(): Promise<any> {
    const image: Photo = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      saveToGallery: false,
    });

    //Save photo at firestorage and recive imageUrl
    const imageBlob = await this.database64ToBlob(image.base64String);
    const imageName = this.imageName() + '.jpeg';
    const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
    const urlPhoto = await this.storeImage(imageFile);

    //Ask for position
    const coordinatesPhoto = this.geolocationService.getLocation();
    const lat = (await coordinatesPhoto).position.lat.toString();
    const long = (await coordinatesPhoto).position.lng.toString();

    //Create a new object capture
    this.isNewEntry = true;
    const newCapture: Capture = {
      imageUrl: urlPhoto.toString(),
      idCapture: Number(this.imageName()),
      latitude: lat,
      longitude: long,
      date: String(new Date()),
      description: '',
      name: '',
      publicState: true,
      uid: this.authService.getToken(),
      votes: 0,
      dislikeChecked: false,
    };
    this.savedCapture = newCapture;
    return newCapture;
  }

  /*-----------------Functions for camera image---------------*/
  //Create a name for the image
  private imageName(): number {
    const newTime = Math.floor(Date.now() / 1000);
    return Math.floor(Math.random() * 20) + newTime;
  }
  //Transfrom image from database64 to blob
  private database64ToBlob(database64) {
    const byteString = atob(database64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }
  //Store the photo
  async storeImage(imageData: any) {
    try {
      const imageName = this.imageName();
      return new Promise((resolve, reject) => {
        const pictureRef = this.storage.ref(
          'captures/' +
            this.authService.getToken() +
            '/' +
            this.imageName() +
            '.jpg'
        );
        pictureRef
          .put(imageData)
          .then(function () {
            pictureRef.getDownloadURL().subscribe((url: any) => {
              resolve(url);
            });
          })
          .catch((error) => {
            reject(error);
          });
      });
    } catch (e) {}
  }
}
