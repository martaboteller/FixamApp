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
  usersFromFirebase: User[];
  usersRef: AngularFirestoreCollection<User>;

  constructor(
    private authService: AuthService,
    private angularFirestore: AngularFirestore
  ) {}

  /*---------------------Get users & specific username---------------------*/
  getUsersFromFirebase(): AngularFirestoreCollection<User> {
    this.usersRef = this.angularFirestore.collection('users');
    this.saveUsersToArray();
    return this.usersRef;
  }

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

  filterUserByUid(uid: string): string {
    if (this.usersFromFirebase != null) {
      return this.usersFromFirebase.filter((user) => user.uid == uid)[0]
        .username;
    }
  }
}
