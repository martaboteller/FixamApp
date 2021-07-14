/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Capture, User } from 'src/app/interfaces/interfaces';
import { CapturesService } from '../captures/captures.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore
  ) {}

  setUserLogged(token: string) {
    sessionStorage.setItem('userToken', token);
  }

  hasSession(): boolean {
    const user = sessionStorage.getItem('userToken');

    if (user && user !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  getToken(): string {
    return sessionStorage.getItem('userToken');
  }

  getUserLogged(): Observable<any> {
    const id: string = this.getToken();
    return this.angularFirestore.collection('users').doc(id).get();
  }

  login(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fireAuth
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
          const id: string = response.user.uid;
          resolve(id);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  register(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fireAuth
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((response) => {
          this.angularFirestore.collection('users').doc(response.user.uid).set({
            uid: response.user.uid,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            avatarFilename: null,
            avatarURL: null
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  logout() {
    sessionStorage.removeItem('userToken');
    this.fireAuth.signOut();
  }
}
