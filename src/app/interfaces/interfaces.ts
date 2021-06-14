export interface Capture {
  idCapture: number;
  name: string;
  description: string;
  location: string;
  date: string;
  author: string;
  votes: number;
  public: boolean;
  image: string;
}

export interface User {
  idUser: number;
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
}
