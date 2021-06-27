import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capture } from 'src/app/interfaces/interfaces';
import { User } from 'src/app/interfaces/interfaces';
import { CapturesService } from 'src/app/services/captures/captures.service';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  //Variables
  public listOfCaptures: Capture[];
  public listOfUsers: User[];
  public dislikeChecked: boolean = false;

  constructor(
    private router: Router,
    private capturesService: CapturesService,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  ngAfterContentInit() {
    this.loadCaptures();
    this.loadUsers();
  }

  //Call service and retrive data from Firebase
  loadCaptures(): void {
    this.capturesService
      .getCapturesFromFirebase()
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
        this.listOfCaptures = data;
      });
  }

  //Get user's name
  loadUsers() {
    this.usersService
      .getUsersFromFirebase()
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
        this.listOfUsers = data;
      });
  }

  getUsername(uid: string): string {
    return this.usersService.filterUserByUid(uid);
  }

  //Go to detail if card pressed
  goToDetail(imageUrl: string, idCapture: number) {
    this.router.navigate(['../../menu/first/detail/', imageUrl, idCapture]);
  }

  //Update dislike status
  checkDislike(idCapture: number) {
    //Identify capture
    const touchedCap = this.capturesService.filterCaptureById(idCapture);
    //Change dislike status
    if (touchedCap.dislikeChecked) {
      touchedCap.dislikeChecked = false;
      touchedCap.votes--;
    } else {
      touchedCap.dislikeChecked = true;
      touchedCap.votes++;
    }

    //Update capture
    this.capturesService.updateCapture(touchedCap);
  }
}
