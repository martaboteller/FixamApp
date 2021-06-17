import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  registerForm: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.registerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
    });
  }

  register(){
    if(this.registerForm.valid){
      const user: User = {} as User;
      user.name = this.registerForm.get('name').value;
      user.surname = this.registerForm.get('surname').value;
      user.username = this.registerForm.get('username').value;
      user.password = this.registerForm.get('password').value;
      user.email = this.registerForm.get('email').value;

      this.auth.register(user).then(
        response => {
          this.auth.setUserLogged(response.user.uid);
          this.router.navigate(['../../menu/first/list']);
        }
      ).catch(
        error => {
          console.log(error);
        }
      );
    }
  }

}
