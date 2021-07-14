export interface Capture {
  idCapture: number;
  imageUrl: string;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  date: string;
  uid: string;
  votes: number;
  publicState: boolean;
  dislikeChecked: boolean;
}

export interface User {
  uid: string;
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
  avatarFilename: string;
  avatarURL: string
}

export interface Photo {
  filepath: string;
  webviewPath: string;
}

export interface MapMarker {
  position: {
    lat: number;
    lng: number;
  };
  votes: number;
  idCapture: number;
}
