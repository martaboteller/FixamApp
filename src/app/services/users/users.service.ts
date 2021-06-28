import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/app/interfaces/interfaces';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  //Variables
  usersRef: AngularFirestoreCollection<User>;
  usersFromFirebase: User[];

  constructor(private angularFirestore: AngularFirestore) {}

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
      return this.usersFromFirebase.filter((user) => user.uid == uid)[0]
        .username;
    }
  }
}
