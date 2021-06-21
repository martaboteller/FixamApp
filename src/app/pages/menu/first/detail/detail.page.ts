import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CapturesService } from 'src/app/services/captures/captures.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  //Variables
  photoUrl: string;

  constructor(
    private captureService: CapturesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadDetailCapture();
  }

  loadDetailCapture() {
    //Show photo
    this.photoUrl = this.route.snapshot.paramMap.get('url');
  }
}
