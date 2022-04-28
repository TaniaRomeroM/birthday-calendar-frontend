import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/models/usuario';
import { TokenService } from './service/token.service';
import { UsuarioService } from './service/usuario.service';
import {MenuItem} from 'primeng/api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isLogged = false;

  usuario: Usuario = {  // Modal de Nuevo Contacto
    usuarioId: null,
    nombre: null,
    apellido: null,
    fechanac: null,
    email: null,
    nombreUsuario: null,
    password: null
  };
  items: MenuItem[];

  constructor(private tokenService: TokenService, private router: Router, private usuarioService: UsuarioService) { }

  getUsuario() { // NO SE RECARGA AL ENTRAR EN LA PAGINA
    if (this.tokenService.getToken()) {
      this.usuarioService.getUsuarioByNombreUsuario(this.tokenService.getUsername()).subscribe(
        (result: any) => {
         this.usuario = result as Usuario;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  routePerfil() {
    this.router.navigate(['perfil']);
  }

  ngOnInit() {
    if(this.tokenService.getToken()) {
      this.isLogged = true;
      this.getUsuario();
    } else {
      this.isLogged = false;
    }

    this.items = [
      {label: 'Cerrar Sesión', icon: 'pi pi-sign-out', command: () => {
        this.onLogOut();
    }},
  ];
  }

  ngDoCheck() {
    if(this.tokenService.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

  onLogOut(): void {
    this.tokenService.logOut();
    this.router.navigate(['/']);
    //window.location.reload();
  }
}
