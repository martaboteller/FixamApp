import { Injectable } from '@angular/core';
import { Capture } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CapturesService {
  private capturesArray: Capture[] = [
    {
      idCapture: 1,
      name: 'Capture 1',
      description: 'This is the description of capture 1',
      location: '',
      date: '01-05-2021',
      author: 'user1',
      votes: 1300,
      public: true,
      image: '',
    },
    {
      idCapture: 2,
      name: 'Capture 2',
      description: 'This is the description of capture 2',
      location: '',
      date: '03-07-2021',
      author: 'user2',
      votes: 400,
      public: true,
      image: '',
    },
    {
      idCapture: 3,
      name: 'Capture 3',
      description: 'This is the description of capture 3',
      location: '',
      date: '12-04-2020',
      author: 'user3',
      votes: 750,
      public: true,
      image: '',
    },
    {
      idCapture: 4,
      name: 'Capture 4',
      description: 'This is the description of capture 4',
      location: '',
      date: '01-05-2021',
      author: 'user1',
      votes: 1300,
      public: true,
      image: '',
    },
    {
      idCapture: 5,
      name: 'Capture 5',
      description: 'This is the description of capture 5',
      location: '',
      date: '03-07-2021',
      author: 'user2',
      votes: 400,
      public: true,
      image: '',
    },
    {
      idCapture: 6,
      name: 'Capture 6',
      description: 'This is the description of capture 6',
      location: '',
      date: '12-04-2020',
      author: 'user3',
      votes: 750,
      public: true,
      image: '',
    },
  ];

  constructor() {}

  public getCaptures() {
    return this.capturesArray;
  }

  public getCapturesById(idCapture: number): Capture {
    return this.capturesArray.filter(
      (capture) => capture.idCapture === +idCapture
    )[0];
  }
}
