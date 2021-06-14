import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capture } from 'src/app/interfaces/interfaces';
import { CapturesService } from 'src/app/services/captures/captures.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  //Declaration of variables
  public listOfCaptures: Capture[];

  constructor(
    private router: Router,
    private captureService: CapturesService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  //Get data from the service
  loadData() {
    this.listOfCaptures = this.captureService.getCaptures();
  }
}
