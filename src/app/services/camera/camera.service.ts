import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Capture } from 'src/app/interfaces/interfaces';
import { AuthService } from '../auth/auth.service';
import { GeolocationService } from '../geolocation/geolocation.service';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  //Variables
  savedCapture: Capture = <Capture>{};
  idCapture: number = 0;
  photoName: string = '';

  constructor(
    private geolocationService: GeolocationService,
    private authService: AuthService,
    private storage: AngularFireStorage
  ) {}

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
    this.idCapture = this.imageName();
    this.photoName = this.idCapture + '.jpeg';
    const imageFile = new File([imageBlob], this.photoName, {
      type: 'image/jpeg',
    });
    const urlPhoto = await this.storeImage(imageFile);

    //Ask for position
    const coordinatesPhoto = this.geolocationService.getLocation();
    const lat = (await coordinatesPhoto).position.lat.toString();
    const long = (await coordinatesPhoto).position.lng.toString();

    //Create a new object capture
    const newCapture: Capture = {
      imageUrl: urlPhoto.toString(),
      idCapture: this.idCapture,
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

  //Store photo at Firebase
  async storeImage(imageFile: File): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const pictureRef = this.storage.ref(
          'captures/' + this.authService.getToken() + '/' + this.photoName
        );
        pictureRef
          .put(imageFile)
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

  //Delete photo at Firebase if user does not save it
  async deleteImage(imageUrl: string) {
    console.log('I am going to delete this!!' + imageUrl);
    let pictureRef = this.storage.refFromURL(imageUrl);
    pictureRef.delete();
  }

  /*-----------------Functions for camera ---------------*/

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
}
