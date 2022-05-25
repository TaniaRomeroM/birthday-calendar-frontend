import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Sugerencia } from 'src/models/sugerencia';
import { Usuario } from 'src/models/usuario';
import { SugerenciaService } from '../service/sugerencia.service';
import { TokenService } from '../service/token.service';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-sugerencias-c',
  templateUrl: './sugerencias-c.component.html',
  styleUrls: ['./sugerencias-c.component.css']
})
export class SugerenciasCComponent implements OnInit {

  sugerencias: Sugerencia[];
  sugerencia: Sugerencia = {
    sugerenciaId: null,
    usuarioId: null,
    nombre: null,
    descripcion: null,
    estadoSugerencia: null,
    nombreUsuario: null
  };
  cols: any[];
  submitted: boolean;
  displaySaveDialogUsuario: boolean = false;

  /* ADMIN */
  sugerenciasAdmin: Sugerencia[];
  sugerenciaAdmin: Sugerencia = {
    sugerenciaId: null,
    usuarioId: null,
    nombre: null,
    descripcion: null,
    estadoSugerencia: null,
    nombreUsuario: null
  };

  seleccionEstado: any; // Necesario para el p-dropdown del modal EditarSugerencia del Admin
  estados: any = [
    { estado: 'PENDIENTE' },
    { estado: 'REALIZADA' },
    { estado: 'ACEPTADA' },
    { estado: 'RECHAZADA' }
  ]

  colsAdmin: any[];
  displaySaveDialogAdminVer: boolean = false;
  displaySaveDialogAdminEditar: boolean = false;

  title: string;
  disabled: boolean = false;
  isVer: boolean = false;
  isAdmin: boolean = false; // Admin

  constructor(
    private tokenService: TokenService,
    private sugerenciaService: SugerenciaService,
    private messageService: MessageService,
    private usuarioService: UsuarioService) { }

  /*  USUARIO */
  abrirModal() {
    this.sugerencia = {
      sugerenciaId: null,
      usuarioId: null,
      nombre: null,
      descripcion: null,
      estadoSugerencia: null,
      nombreUsuario: null
    };
    this.submitted = false;
    this.title = "Nueva Sugerencia";
    this.isVer = false;
    this.disabled = false;
    this.displaySaveDialogUsuario = true;
  }

  cerrarDialog() {
    this.displaySaveDialogUsuario = false;
    this.displaySaveDialogAdminVer = false;
    this.displaySaveDialogAdminEditar = false;
    this.submitted = false;
  }

  getAllSugerenciasUsuario() {
    if (this.tokenService.getToken()) {
      this.sugerenciaService.getAllNombreUsuario(this.tokenService.getUsername()).subscribe(
        (result: any) => {
          let sugerencias: Sugerencia[] = [];
          for (let i = 0; i < result.length; i++) {
            let sugerencia = result[i] as Sugerencia;
            sugerencias.push(sugerencia);
          }
          this.sugerencias = sugerencias;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  addSugerencia() {
    if (this.tokenService.getToken()) {
    this.submitted = true;
    this.usuarioService.getUsuarioByNombreUsuario(this.tokenService.getUsername()).subscribe( // Procesos que surgan una vez se ha guardado el contacto
      (result: any) => {
        let usuario = result as Usuario;
        this.sugerencia.usuarioId = usuario.usuarioId;
        this.sugerencia.estadoSugerencia = "PENDIENTE";
        this.sugerenciaService.addSugerencia(this.sugerencia).subscribe( // Procesos que surgan una vez se ha guardado el contacto
          (result: any) => {
            let sugerencia = result as Sugerencia;
            this.messageService.add({ severity: 'success', summary: "Nueva sugerencia", detail: "Se ha enviado la sugerencia correctamente." });
            this.displaySaveDialogUsuario = false; // Cierra el modal
            this.getAllSugerenciasUsuario();
          },
          error => {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar la sugerencia: ' + error.error.message });
          }
        )
      },
      error => {
        console.log(error);
      }
    )
    }
  }

  verSugerenciaUsuario(sugerencia: Sugerencia) {
    this.sugerencia = { ...sugerencia };
    this.title = "Sugerencia";
    this.disabled = true;
    this.displaySaveDialogUsuario = true;
    this.isVer = true;
  }

  /* ADMIN */
  getAllSugerenciasAdmin() {
    if (this.tokenService.getToken()) {
      this.sugerenciaService.getAll().subscribe(
        (result: any) => {
          let sugerenciasAdmin: Sugerencia[] = [];
          for (let i = 0; i < result.length; i++) {
            let sugerenciaAdmin = result[i] as Sugerencia;

            this.usuarioService.encontrarUsuario(sugerenciaAdmin.usuarioId).subscribe(
              (result: any) => {
                for (let i = 0; i < result.length; i++) {
                  let usuario = result[i] as Usuario; // Convertir la variable fiesta (que no tiene un tipo definido) en una variable de tipo Fiesta
                  sugerenciaAdmin.nombreUsuario = usuario.nombre;
                }
              },
              error => {
                console.log(error);
              }
            );
            sugerenciasAdmin.push(sugerenciaAdmin);
          }
          this.sugerenciasAdmin = sugerenciasAdmin;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  verSugerenciaAdmin(sugerenciaAdmin: Sugerencia) {
    this.sugerenciaAdmin = { ...sugerenciaAdmin };
    this.title = "Sugerencia";
    this.isVer = true;
    this.disabled = true;
    this.displaySaveDialogAdminVer = true;
  }

  abrilModalEstadoAdmin(sugerenciaAdmin: Sugerencia) {
    this.sugerenciaAdmin = { ...sugerenciaAdmin };
    this.seleccionEstado = this.sugerenciaAdmin.estadoSugerencia; // Para que aparezca el estado de la sugerencia seleccionada
    this.title = "Editar estado";
    this.isVer = false;
    this.displaySaveDialogAdminEditar = true;
  }

  editarEstadoAdmin() {
    this.sugerenciaAdmin.estadoSugerencia = this.seleccionEstado;
    if (this.tokenService.getToken()) {
      this.sugerenciaService.addSugerencia(this.sugerenciaAdmin).subscribe(
        (result: any) => {
          let sugerenciaAdmin = result as Sugerencia;
          this.messageService.add({ severity: 'success', summary: "Sugerencia editada", detail: "Se ha editado el estado correctamente." });
          this.displaySaveDialogAdminEditar = false; // Cierra el modal
          this.getAllSugerenciasAdmin();
          this.seleccionEstado = null;
        },
        error => {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error al editar el estado', detail: 'El campo no debe estar vacío'});
        }
      );
    }

  }

  ngOnInit(): void {
    this.getAllSugerenciasUsuario();
    this.isAdmin = this.tokenService.isAdmin();

    if (this.isAdmin) {
      this.getAllSugerenciasAdmin();
    }

    this.cols = [
      { field: "nombre", header: "Título" },
    ];
    this.colsAdmin = [
      { field: "nombreUsuario", header: "Usuario" },
      { field: "nombre", header: "Título" },
    ];
  }

}
