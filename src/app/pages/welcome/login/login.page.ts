import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastController
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  async presentToast() {
    const toast = await this.toast.create({
      message: 'Login incorrecto',
      duration: 4000
    });
    toast.present();
  }

  buildForm(): void {
    this.loginForm = new FormGroup({
      password: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
    });
  }

  login(){
    if(this.loginForm.valid){
      const email = this.loginForm.get('email').value;
      const password = this.loginForm.get('password').value;

      this.authService.login(email, password).then(
        response => {
          this.authService.setUserLogged(response);
          this.router.navigate(['../../menu/first/list']);
        }
      ).catch(
        error => {
          this.presentToast();
          console.log(error);
        }
      );
    }
  }

}
