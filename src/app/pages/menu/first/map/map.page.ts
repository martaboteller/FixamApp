import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapMarker } from 'src/app/interfaces/interfaces';
import { CapturesService } from 'src/app/services/captures/captures.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';

declare const google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  //Will use this to interact with html tag in map.page.html
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;

  //Variables
  public listOfCoordinates: MapMarker[] = [];

  constructor(
    private captureService: CapturesService,
    private geolocationService: GeolocationService,
    private route: ActivatedRoute
  ) {}

  async ionViewDidEnter() {
    this.listOfCoordinates = this.captureService.getAllLocations();
    this.chooseCenterMapAndDisplay();
    this.renderMarkers();
  }

  async chooseCenterMapAndDisplay() {
    //Coming from  map tab
    var centerMapTo: MapMarker;
    if (this.route.snapshot.paramMap.get('idCapture') == null) {
      centerMapTo = await this.geolocationService.getLocation();
    } else {
      //Coming from detail page
      const idCapture = Number(this.route.snapshot.paramMap.get('idCapture'));
      centerMapTo = this.captureService.filterLocationById(idCapture);
    }
    this.displayGoogleMap(centerMapTo);
  }

  async displayGoogleMap(mapMarker: MapMarker) {
    const latLng = new google.maps.LatLng(
      mapMarker.position.lat,
      mapMarker.position.lng
    );
    const mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.renderMarkers();
      this.mapElement.nativeElement.classList.add('show-map');
    });
  }

  renderMarkers() {
    this.listOfCoordinates.forEach((marker) => {
      this.addMarker(marker);
    });
  }

  addMarker(marker: MapMarker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      label: marker.votes.toString(),
      icon: '/assets/icon/my_marker.png',
    });
  }
}
