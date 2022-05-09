import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/models/usuario';
import { TokenService } from './service/token.service';
import { UsuarioService } from './service/usuario.service';
import { MenuItem } from 'primeng/api';
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

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  getUsuario() {
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
    this.isLogged = this.tokenService.isLogged();

    /* this.getUsuario(); */ // FALTA

    this.items = [
      { label: 'Perfil', icon: 'pi pi-user-edit', routerLink: ['perfil'] },
      {
        label: 'Cerrar Sesión', icon: 'pi pi-sign-out', command: () => {
          this.onLogOut();
        }
      }
    ];
  }

  ngDoCheck() {
    this.isLogged = this.tokenService.isLogged();
  }

  onLogOut(): void {
    this.tokenService.logOut();
    this.router.navigate(['/']);
  }
}
