import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/models/usuario';
import { TokenService } from './service/token.service';
import { UsuarioService } from './service/usuario.service';
import { MenuItem } from 'primeng/api';
import { ContactoService } from './service/contacto.service';
import { Contacto } from 'src/models/contacto';
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
  contactos: Contacto[];
  contacto: Contacto = {  // Modal de Nuevo Contacto
    contactoId: null,
    usuarioId: null,
    nombre: null,
    apellido: null,
    fechanac: null,
    email: null,
    edad: null
  };
  items: MenuItem[];
  valorNot: number = null;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private usuarioService: UsuarioService,
    private contactoService: ContactoService
  ) { }

  /*getUsuario() {
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
  }*/

  routePerfil() {
    this.router.navigate(['perfil']);
  }

  getContactosNotif() {
    if (this.tokenService.getToken()) {
      this.contactoService.getAllContactosNotif(this.tokenService.getUsername()).subscribe(
        (result: any) => {
          let contactos: Contacto[] = [];
          for (let i = 0; i < result.length; i++) {
            let contacto = result[i] as Contacto;
            this.valorNot++;
            contactos.push(contacto);
          }
          this.contactos = contactos;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  ngOnInit() {
    this.isLogged = this.tokenService.isLogged();
    if (this.isLogged) {
      this.getContactosNotif();
      this.usuario.nombreUsuario = this.tokenService.getUsername();
      console.log("ENTRA")
      this.items = [
        { label: 'Perfil', icon: 'pi pi-user-edit', routerLink: ['perfil'] },
        {
          label: 'Cerrar Sesión', icon: 'pi pi-sign-out', command: () => {
            this.onLogOut();
          }
        }
      ];
    }
  }

  ngDoCheck() {
    this.isLogged = this.tokenService.isLogged();
  }

  onLogOut(): void {
    this.tokenService.logOut();
    this.router.navigate(['/']);
  }
}
