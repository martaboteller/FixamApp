import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capture } from 'src/app/interfaces/interfaces';
import { CapturesService } from 'src/app/services/captures/captures.service';
import { PhotoService } from 'src/app/services/photo/photo.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  //Variables
  public listOfCaptures: Capture[];

  constructor(
    private router: Router,
    private captureService: CapturesService,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  //Get data Captures service
  loadData() {
    this.listOfCaptures = this.captureService.getCaptures();
  }

  //Add photos to gallery
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
