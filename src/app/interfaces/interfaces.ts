import { Timestamp } from 'rxjs';

export interface Capture {
  idCapture: number;
  imageName: string;
  imageUrl: string;
  name: string;
  description: string;
  coordinates: string;
  date: string;
  author: string;
  votes: number;
  public: boolean;
}

export interface User {
  idUser: number;
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
}

export interface Photo {
  filepath: string;
  webviewPath: string;
}
