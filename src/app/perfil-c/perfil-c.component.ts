import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/models/usuario';
import { TokenService } from '../service/token.service';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-perfil-c',
  templateUrl: './perfil-c.component.html',
  styleUrls: ['./perfil-c.component.css']
})
export class PerfilCComponent implements OnInit {

  usuario: Usuario = {
    usuarioId: null,
    nombre: null,
    apellido: null,
    fechanac: null,
    email: null,
    nombreUsuario: null,
    password: null
  };
  disabled: boolean = true;

  constructor(private usuarioService: UsuarioService, private tokenService: TokenService) {}

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

  btnEditarUsuario() {
    this.disabled = false;
  }

  btnCancelar() {
    this.disabled = true;
  }

  btnGuardar() {
    console.log("guardado");
    this.disabled = true;
  }

  ngOnInit(): void {
    this.getUsuario();
  }

}
