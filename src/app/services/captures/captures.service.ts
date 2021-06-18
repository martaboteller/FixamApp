import { Injectable } from '@angular/core';
import { Capture } from 'src/app/interfaces/interfaces';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../auth/auth.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class CapturesService {

  private capturesArray: Capture[] = [
    {
      idCapture: 1,
      name: 'Capture 1',
      description: 'This is the description of capture 1',
      location: '',
      date: '01-05-2021',
      author: 'user1',
      votes: 1300,
      public: true,
      image: '',
    },
    {
      idCapture: 2,
      name: 'Capture 2',
      description: 'This is the description of capture 2',
      location: '',
      date: '03-07-2021',
      author: 'user2',
      votes: 400,
      public: true,
      image: '',
    },
    {
      idCapture: 3,
      name: 'Capture 3',
      description: 'This is the description of capture 3',
      location: '',
      date: '12-04-2020',
      author: 'user3',
      votes: 750,
      public: true,
      image: '',
    },
    {
      idCapture: 4,
      name: 'Capture 4',
      description: 'This is the description of capture 4',
      location: '',
      date: '01-05-2021',
      author: 'user1',
      votes: 1300,
      public: true,
      image: '',
    },
    {
      idCapture: 5,
      name: 'Capture 5',
      description: 'This is the description of capture 5',
      location: '',
      date: '03-07-2021',
      author: 'user2',
      votes: 400,
      public: true,
      image: '',
    },
    {
      idCapture: 6,
      name: 'Capture 6',
      description: 'This is the description of capture 6',
      location: '',
      date: '12-04-2020',
      author: 'user3',
      votes: 750,
      public: true,
      image: '',
    },
  ];

  constructor(
    private storage: AngularFireStorage,
    private authService: AuthService
    ) {}

  async takePhoto(){
    const image: Photo = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType:CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    const imageBlob = await this.dataURItoBlob(image);

    const imageName = this.imageName() + '.jpeg';
    const imageFile = new File([imageBlob], imageName, {type: 'image/jpeg'});

    const urlPhoto = await this.storePhoto(imageFile);
    console.log(urlPhoto);
  }

  storePhoto(image: File){
    return new Promise((resolve, reject) => {
      const pictureRef = this.storage.ref('captures/' + this.authService.getToken() + '/' + this.imageName());

      pictureRef.put(image).then(
        () => {
          pictureRef.getDownloadURL().subscribe(
            (url) => {
              resolve(url);
            }
          );
        }
      ).catch(
        error => {
          reject(error);
        }
      );
    });
  }


  public getCaptures() {
    return this.capturesArray;
  }

  public getCapturesById(idCapture: number): Capture {
    return this.capturesArray.filter(
      (capture) => capture.idCapture === +idCapture
    )[0];
  }

  private imageName(): number{
    const newTime = Math.floor(Date.now() / 1000);
    return Math.floor(Math.random() * 20) + newTime;
  }

  private dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
   return blob;
  }
}
