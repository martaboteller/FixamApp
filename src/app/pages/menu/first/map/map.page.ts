import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { ToastController } from '@ionic/angular';

declare const google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  //Will use this to capture and & interact with html tag
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;

  constructor(public toastController: ToastController) {}

  //Ionic loads map with it's functions
  ionViewDidEnter() {
    this.getLocation();
  }

  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.presentToast(
      'Latitud ' +
        coordinates.coords.latitude.toString() +
        ' Longitud ' +
        coordinates.coords.longitude.toString()
    );
    this.loadMap(coordinates);
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  loadMap(coordinates) {
    const latLng = new google.maps.LatLng(
      coordinates.coords.latitude,
      coordinates.coords.longitude
    );
    const mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(this.map);
  }

  addMarker(map) {
    const marker = new google.maps.Marker({
      map,
      animation: google.maps.Animation.DROP,
      position: map.getCenter(),
    });
  }
}
