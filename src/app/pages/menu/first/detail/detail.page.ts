import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Capture } from 'src/app/interfaces/interfaces';
import { CapturesService } from 'src/app/services/captures/captures.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  //Variables
  photoUrl: string;
  idCapture: number;
  activeCapture: Capture;

  constructor(
    private captureService: CapturesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDetailCapture();
  }

  //Show photo
  loadDetailCapture() {
    this.photoUrl = this.route.snapshot.paramMap.get('url');
    this.idCapture = Number(this.route.snapshot.paramMap.get('idCapture'));
    this.activeCapture = this.captureService.getCapturesById(this.idCapture);
  }

  back() {
    this.router.navigate(['../../menu/first/list']);
  }
}
