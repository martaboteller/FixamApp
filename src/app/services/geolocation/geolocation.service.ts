import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { MapMarker } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  //Variables
  listOfCoordinates: MapMarker[];

  constructor() {}

  async getLocation(): Promise<MapMarker> {
    const coordinates = await Geolocation.getCurrentPosition();
    const mapMarker = {
      position: {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      },
      votes: 0,
      idCapture: 0,
      label: 'You are here',
    };
    return mapMarker;
  }
}
