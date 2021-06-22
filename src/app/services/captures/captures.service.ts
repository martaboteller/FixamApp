import { Injectable } from '@angular/core';
import { Capture } from 'src/app/interfaces/interfaces';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../auth/auth.service';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class CapturesService {
  //List of captures of testing purposes

  private photoReturn = { url: '', imageName: '' };
  private capturesArray: Capture[] = [
    {
      idCapture: 1,
      name: 'Capture 1',
      description: 'This is the description of capture 1',
      coordinates: '',
      date: '01-05-2021',
      author: 'user1',
      votes: 1300,
      public: true,
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/fixam-b9324.appspot.com/o/captures%2FdYdcu44ndPeIVsX21zRDbSPnNd32%2Fbasic.png?alt=media&token=85677726-aea7-4aa5-9e63-169944f29a0e',
      imageName: '',
    },
    {
      idCapture: 2,
      name: 'Capture 2',
      description: 'This is the description of capture 2',
      coordinates: '',
      date: '03-07-2021',
      author: 'user2',
      votes: 400,
      public: false,
      imageName: '',

      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/fixam-b9324.appspot.com/o/captures%2FdYdcu44ndPeIVsX21zRDbSPnNd32%2Fbasic.png?alt=media&token=85677726-aea7-4aa5-9e63-169944f29a0e',
    },
    {
      idCapture: 3,
      name: 'Capture 3',
      description: 'This is the description of capture 3',
      coordinates: '',
      date: '12-04-2020',
      author: 'user3',
      votes: 750,
      public: true,
      imageName: '',

      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/fixam-b9324.appspot.com/o/captures%2FdYdcu44ndPeIVsX21zRDbSPnNd32%2Fbasic.png?alt=media&token=85677726-aea7-4aa5-9e63-169944f29a0e',
    },
    {
      idCapture: 4,
      name: 'Capture 4',
      description: 'This is the description of capture 4',
      coordinates: '',
      date: '01-05-2021',
      author: 'user1',
      votes: 1300,
      public: false,
      imageName: '',

      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/fixam-b9324.appspot.com/o/captures%2FdYdcu44ndPeIVsX21zRDbSPnNd32%2Fbasic.png?alt=media&token=85677726-aea7-4aa5-9e63-169944f29a0e',
    },
    {
      idCapture: 5,
      name: 'Capture 5',
      description: 'This is the description of capture 5',
      coordinates: '',
      date: '03-07-2021',
      author: 'user2',
      votes: 400,
      public: true,
      imageName: '',

      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/fixam-b9324.appspot.com/o/captures%2FdYdcu44ndPeIVsX21zRDbSPnNd32%2Fbasic.png?alt=media&token=85677726-aea7-4aa5-9e63-169944f29a0e',
    },
    {
      idCapture: 6,
      name: 'Capture 6',
      description: 'This is the description of capture 6',
      coordinates: '',
      date: '12-04-2020',
      author: 'user3',
      votes: 750,
      public: true,
      imageName: '',

      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/fixam-b9324.appspot.com/o/captures%2FdYdcu44ndPeIVsX21zRDbSPnNd32%2Fbasic.png?alt=media&token=85677726-aea7-4aa5-9e63-169944f29a0e',
    },
  ];

  constructor(
    private storage: AngularFireStorage,
    private authService: AuthService
  ) {}

  //Take a photo with the camera
  async takePhoto(): Promise<any> {
    const image: Photo = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    // console.log('Image '+ image.base64String);
    const imageBlob = await this.database64ToBlob(image.base64String);
    const imageName = this.imageName() + '.jpeg';
    const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
    const urlPhoto = await this.storeImage(imageFile);

    //Return url and image name

    this.photoReturn.url = urlPhoto.toString();
    this.photoReturn.imageName = imageName;
    return this.photoReturn;
  }

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
    console.log('Database64 ' + database64);
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  //Store the photo at Firebase Storage
  async storeImage(imageData: any) {
    try {
      const imageName = this.imageName();
      return new Promise((resolve, reject) => {
        const pictureRef = this.storage.ref(
          'captures/' + this.authService.getToken() + '/' + this.imageName()
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

  /*---This methods will be removed soon-----*/
  public getCaptures() {
    return this.capturesArray;
  }

  public getCapturesById(idCapture: number): Capture {
    return this.capturesArray.filter(
      (capture) => capture.idCapture === +idCapture
    )[0];
  }
}
