import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/models/usuario';
import { TokenService } from '../service/token.service';
import { UsuarioService } from '../service/usuario.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';

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
  pipe = new DatePipe('es');
  todayWithPipe = null;

  constructor(
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) { }


  btnEditarUsuario() {
    this.disabled = false;
  }

  btnCancelar() {
    this.disabled = true;
    this.getUsuario();
  }

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

  editarUsuario() {
    if (this.tokenService.getToken()) {
    if (this.usuario.fechanac instanceof Date) {
      this.todayWithPipe = this.pipe.transform(this.usuario.fechanac, 'dd/MM/yyyy'); // Formatea la fecha que obtiene del formulario Cumpleanyos
      this.usuario.fechanac = this.todayWithPipe;
    }

    this.usuarioService.editarUsuario(this.usuario).subscribe( // Procesos que surgan una vez se ha guardado el contacto
      (result: any) => {
        let usuario = result as Usuario;
        this.usuario = usuario;
        this.messageService.add({ severity: 'success', summary: "Usuario", detail: "Se han modificado los datos correctamente." });
        this.disabled = true;
      },
      error => {
        console.log(error);
      }
    )
    }
  }

  ngOnInit(): void {
    this.getUsuario();
  }
}
