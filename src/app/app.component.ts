import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/models/usuario';
import { TokenService } from './service/token.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  usuario: Usuario = {
    usuarioId: null,
    nombre: null,
    apellido: null,
    fechanac: null,
    email: null,
    nombreUsuario: null,
    password: null
  };

  isLogged = false;

  items = [
    { label: 'Perfil', icon: 'pi pi-user-edit', routerLink: ['perfil'] },
    {
      label: 'Cerrar Sesión', icon: 'pi pi-sign-out', command: () => {
        this.onLogOut();
      }
    }
  ];

  //items: MenuItem[];

  constructor(
    private tokenService: TokenService,
    private router: Router,
  ) { }

  routePerfil() {
    this.router.navigate(['perfil']);
  }

  ngOnInit() {
    this.isLogged = this.tokenService.isLogged();
  }

  ngDoCheck() {
    this.isLogged = this.tokenService.isLogged();
    this.usuario.nombreUsuario = this.tokenService.getUsername();
  }

  onLogOut(): void {
    this.tokenService.logOut();
    //this.router.navigate(['/']);
  }
}
