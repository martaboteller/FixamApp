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
  //Variables
  public listOfCaptures: Capture[];
  public urlBasic: String;

  constructor(
    private router: Router,
    private captureService: CapturesService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  //Get data Captures service
  loadData() {
    this.listOfCaptures = this.captureService.getCaptures();
  }

  //Go to detail if card pressed
  goToDetail(imageUrl: string, idCapture: number) {
    console.log('I amb in list page, this is the url ' + imageUrl);
    this.router.navigate(['../../menu/first/detail/', imageUrl, idCapture]);
  }
}
