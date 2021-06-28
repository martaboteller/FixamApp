import { Injectable, OnInit } from '@angular/core';
import { Capture, MapMarker } from 'src/app/interfaces/interfaces';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CapturesService implements OnInit {
  //Variables
  capturesFromFirebase: Capture[];
  capturesRef: AngularFirestoreCollection<Capture>;
  listOfCoordinates: MapMarker[] = [];

  constructor(private angularFirestore: AngularFirestore) {}

  ngOnInit() {
    this.getCapturesFromFirebase();
  }

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

  //Select one capture from the array of captures
  filterCaptureById(idCapture: number): Capture {
    return this.capturesFromFirebase.filter(
      (capture) => capture.idCapture === +idCapture
    )[0];
  }

  //Get all locations from all captures
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

  //Select one location from the array of locations
  filterLocationById(idCapture: number): MapMarker {
    if (this.listOfCoordinates.length == 0) {
      this.getAllLocations();
    }
    return this.listOfCoordinates.filter(
      (mapMarker) => mapMarker.idCapture === +idCapture
    )[0];
  }

  //Save or update a capture document to Firebase
  updateCapture(capture: Capture): any {
    return this.capturesRef
      .doc(capture.idCapture.toString())
      .set({ ...capture });
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
  deleteCapture(idCapture: string): Promise<void> {
    return this.capturesRef.doc(idCapture).delete();
  }
}
