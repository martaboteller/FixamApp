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
  public publicCaptures: Capture[];
  public personalCaptures: Capture[];
  public capturesToShow: Capture[];
  public listOfUsers: User[];
  public dislikeChecked: boolean = false;
  public showAllCaptures: boolean = true;
  user: User = {} as User;
  public language: string = 'ca';

  constructor(
    private router: Router,
    private capturesService: CapturesService,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCaptures();
    this.loadUsers();
    this.getUserLogged();
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
        this.filterPublicAndMyCaptures(this.authService.getToken());
      });
  }

  //Filter public and user captures
  //Select only public captures and user's captures
  filterPublicAndMyCaptures(uid: string): Capture[] {
    this.publicCaptures = this.listOfCaptures.filter(
      (capture) => capture.publicState == true
    );
    this.personalCaptures = this.listOfCaptures.filter(
      (capture) => capture.uid === uid
    );

    this.capturesToShow = this.personalCaptures.concat(this.publicCaptures);
    this.capturesToShow = this.removeDuplicates(this.capturesToShow);
    return this.capturesToShow;
  }

  //Remove captures duplicated
  removeDuplicates(inArray): Capture[] {
    var arr = inArray.concat(); // create a clone from inArray so not to change input array
    //create the first cycle of the loop starting from element 0 or n
    for (var i = 0; i < arr.length; ++i) {
      //create the second cycle of the loop from element n+1
      for (var j = i + 1; j < arr.length; ++j) {
        //if the two elements are equal , then they are duplicate
        if (arr[i] === arr[j]) {
          arr.splice(j, 1); //remove the duplicated element
        }
      }
    }
    return arr;
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

  getUserLogged() {
    this.usersService.getUserLogged().subscribe(
      (response) => {
        this.user.name = response.name;
        this.user.surname = response.surname;
        this.user.username = response.username;
        this.user.uid = response.uid;
        this.user.email = response.email;
        this.user.avatarFilename = response.avatarFilename;
        this.user.avatarURL = response.avatarURL;

        this.usersService.sendUserData(this.user);
      },
      (error) => {
        console.log(error);
      }
    );
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
      this.capturesToShow = this.capturesService.filterCapturesByUser(
        this.authService.getToken()
      );
    }
  }
}
