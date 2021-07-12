import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capture } from 'src/app/interfaces/interfaces';
import { User } from 'src/app/interfaces/interfaces';
import { CapturesService } from 'src/app/services/captures/captures.service';
import { map } from 'rxjs/operators';
import { UsersService } from 'src/app/services/users/users.service';
import { AuthService } from 'src/app/services/auth/auth.service';

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
  public showAllCaptures: boolean = true;

  constructor(
    private router: Router,
    private capturesService: CapturesService,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCaptures();
    this.loadUsers();
  }

  //Call captureService and retrive captures from Firebase
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

  //Call usersService and retrieve users from Firebase
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

  //Given a uid get the username
  //This will be displayed in every capture card
  getUsername(uid: string): string {
    return this.usersService.filterUserByUid(uid);
  }

  //Go to detail if image card is pressed
  goToDetail(imageUrl: string, idCapture: number) {
    this.router.navigate(['../../menu/first/detail/', imageUrl, idCapture]);
  }

  //Update dislike status
  checkDislike(idCapture: number) {
    this.capturesService.checkDislike(idCapture);
  }

  //Change between showing only the user captures or all captures
  changeDisplayMode(ev) {
    if (ev.detail.checked) {
      console.log('Show all captures');
      this.showAllCaptures = true;
      this.loadCaptures();
    } else {
      console.log('Show only my captures');
      this.showAllCaptures = false;
      this.listOfCaptures = this.capturesService.filterCapturesByUser(
        this.authService.getToken()
      );
    }
  }
}
