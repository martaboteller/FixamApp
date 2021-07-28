import { Injectable, OnInit } from '@angular/core';
import { Capture, MapMarker } from 'src/app/interfaces/interfaces';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CapturesService {
  //Variables
  public capturesFromFirebase: Capture[];
  public capturesRef: AngularFirestoreCollection<Capture>;
  public listOfCoordinates: MapMarker[] = [];
  success: boolean = false;

  constructor(
    private angularFirestore: AngularFirestore,
    private auth: AuthService
  ) {}

  //Get all collections of captures from Firebase
  getCapturesFromFirebase(): AngularFirestoreCollection<Capture> {
    this.capturesRef = this.angularFirestore.collection('captures');
    this.saveCapturesToArray();
    return this.capturesRef;
  }

  //Pass data from AngularFirestoreCollection<Capture> into an array
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

  //Select only captures from one user
  filterCapturesByUser(uid: string): Capture[] {
    return this.capturesFromFirebase.filter((capture) => capture.uid === uid);
  }

  //Select one capture from the array of captures
  filterCaptureById(idCapture: number): Capture {
    return this.capturesFromFirebase.filter(
      (capture) => capture.idCapture === +idCapture
    )[0];
  }

  getUrlImageById(idCapture: number): String {
    return this.capturesFromFirebase.filter(
      (capture) => capture.idCapture === +idCapture
    )[0].imageUrl;
  }

  //Check if capture belongs to logged user
  belongsToLoggedUser(idCapture: number, uid: string): boolean {
    if (this.filterCaptureById(idCapture).uid === uid) {
      return true;
    } else {
      return false;
    }
  }

  //Check if capture exists
  doesExist(idCapture: number): boolean {
    try {
      this.getCapturesFromFirebase();
      this.saveCapturesToArray();
      const name = this.filterCaptureById(idCapture).name;
      if (name === '') {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      return false;
    }
  }

  //Get all locations from all captures
  getAllLocations(): MapMarker[] {
    if (this.capturesFromFirebase.length === 0) {
      this.getCapturesFromFirebase();
      //console.log('Empty captures list');
    }
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

  //Select one location from the array of locations
  filterLocationById(idCapture: number): MapMarker {
    if (this.listOfCoordinates.length === 0) {
      this.getAllLocations();
    }
    return this.listOfCoordinates.filter(
      (mapMarker) => mapMarker.idCapture === +idCapture
    )[0];
  }

  //Save or update a capture document to Firebase
  updateCapture(capture: Capture): boolean {
    try {
      this.capturesRef.doc(capture.idCapture.toString()).set({ ...capture });
      this.getCapturesFromFirebase();
      this.success = true;
    } catch (e) {
      console.log(e);
    }
    return this.success;
  }

  //Update dislike status at Firebase
  checkDislike(idCapture: number) {
    //Identify capture
    const touchedCap = this.filterCaptureById(idCapture);
    //Change dislike status
    if (touchedCap.dislikeChecked) {
      touchedCap.dislikeChecked = false;
      touchedCap.votes--;
    } else {
      touchedCap.dislikeChecked = true;
      touchedCap.votes++;
    }
    //Update capture at Firebase
    this.updateCapture(touchedCap);
  }

  //Delete a capture document from Firebase
  deleteCapture(idCapture: string): boolean {
    try {
      this.capturesRef.doc(idCapture).delete();
      this.getCapturesFromFirebase();
      this.saveCapturesToArray();
      this.success = true;
    } catch (e) {
      console.log(e);
    }
    return this.success;
  }
}
