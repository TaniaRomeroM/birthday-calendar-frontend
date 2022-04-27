import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUsuario } from 'src/models/login-usuario';
import { AuthService } from '../service/auth.service';
import { TokenService } from '../service/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLogged = false;
  isLoginFail = false;
  loginUsuario: LoginUsuario;
  nombreUsuario: string;
  password: string;
  roles: string[] = [];
  //errMsg: string;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin(): void {
    this.loginUsuario = new LoginUsuario(this.nombreUsuario, this.password);
    this.authService.login(this.loginUsuario).subscribe(
      data => {
        this.isLogged = true;
        this.isLoginFail = false;

        this.tokenService.setToken(data.token);
        this.tokenService.setUsername(data.nombreUsuario);
        this.tokenService.setAuthorites(data.authorities);
        this.roles = data.authorities;

        this.router.navigate(['/inicio']);
        //this.router.navigate(['/'])
      },
      err => {
        this.isLogged = false;
        this.isLoginFail = true;
        console.log("error en el login usuario");
        //this.errMsg = err.error.mensaje
      }
    );
  }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }
}
