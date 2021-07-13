import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/app/interfaces/interfaces';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  //Variables
  usersRef: AngularFirestoreCollection<User>;
  usersFromFirebase: User[];
  private shareUserLogged = new Subject<any>();

  constructor(
    private angularFirestore: AngularFirestore,
    private authService: AuthService,
    private storage: AngularFireStorage
  ) {}

  sendUserData(user: User) {
    this.shareUserLogged.next({user: user});
  }

  onMessage(): Observable<any> {
    return this.shareUserLogged.asObservable();
}

  //Get the collection of users from Firebase
  getUsersFromFirebase(): AngularFirestoreCollection<User> {
    this.usersRef = this.angularFirestore.collection('users');
    this.saveUsersToArray();
    return this.usersRef;
  }

  //Pass data from AngularFirestoreCollection<User> into an array
  saveUsersToArray(): void {
    this.usersRef
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
        this.usersFromFirebase = data;
      });
  }

  //Given an uid retrieve the username
  filterUserByUid(uid: string): string {
    if (this.usersFromFirebase != null) {
      return this.usersFromFirebase.filter((user) => user.uid == uid)[0].username;   
    }
  }

  getUserLogged(): Observable<any>{
    const id: string = this.authService.getToken();
    return this.angularFirestore.collection('users').doc(id).valueChanges();
  }

  
  uploadAvatar(image: File){
    const imageName = this.imageName();
    return new Promise((resolve, reject) => {
      const pictureRef = this.storage.ref('userImages/' + this.authService.getToken() + '/' + imageName);

      pictureRef.put(image).then(function () {
        pictureRef.getDownloadURL().subscribe((url: any) => {
          const avatar = {
            filename: imageName,
            imageURL: url
          }
          resolve(avatar);
        });
      })
      .catch((error) => {
          reject(error);
      });
    });
  }

  updateUser(user: User): Promise<any>{
    return new Promise ((resolve, reject) => { 
      this.angularFirestore.collection('users').doc(this.authService.getToken()).update(user).then(
        () => {
          resolve('Cambios guardados correctamente');
        }
      ).catch(
        error => {
          reject(error);
        }
      );
    })  
    
  }

  //Create a name for the image
  private imageName(): number{
    const newTime = Math.floor(Date.now() / 1000);
    return Math.floor(Math.random() * 20) + newTime;
  }

  deleteAvatar(user): Observable<any>{
    const pictureRef = this.storage.ref('userImages/' + this.authService.getToken() + '/' + user.avatarFilename);

    return pictureRef.delete();
  }
}
