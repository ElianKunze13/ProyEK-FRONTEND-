import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';

import { LoginService } from '../../Servicio/auth2/login.service';
import { LoginRequest } from '../../Servicio/auth2/loginRequest';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
loginError:string="";

  loginForm:any;
  constructor(private formBuilder:FormBuilder, private router:Router, private loginService: LoginService) {

    this.loginForm=this.formBuilder.group({
    username:['',[Validators.required,Validators.email]],
    password: ['',[Validators.required, Validators.minLength(8)]],
  })
  }

  ngOnInit(): void {
  }

  get email(){
    return this.loginForm.controls.username;
  }

  get password()
  {
    return this.loginForm.controls.password;
  }

  login(){
    if(this.loginForm.valid){
      this.loginError="";
      this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (userData: any) => {
          console.log(userData);
        },
        error: (errorData: string) => {
          console.error(errorData);
          this.loginError=errorData;
        },
        complete: () => {
          console.info("Login completo");
          this.router.navigateByUrl('/main');
          this.loginForm.reset();
        }
      })

    }
    else{
      this.loginForm.markAllAsTouched();
      alert("Error al ingresar los datos.");
    }
  }

}
