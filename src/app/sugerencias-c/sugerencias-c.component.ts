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
    estadoSugerencia: null  /* ENUM */
  };
  cols: any[];
  submitted: boolean;
  displaySaveDialog: boolean = false;

  /* ADMIN */
  sugerenciasAdmin: Sugerencia[];
  sugerenciaAdmin: Sugerencia = {
    sugerenciaId: null,
    usuarioId: null,
    nombre: null,
    descripcion: null,
    estadoSugerencia: null  /* ENUM */
  };
  colsAdmin: any[];
  ///
  constructor(private tokenService: TokenService, private sugerenciaService: SugerenciaService, private messageService: MessageService, private usuarioService: UsuarioService) { }

  abrirModal() {
    this.sugerencia = {
      sugerenciaId: null,
      usuarioId: null,
      nombre: null,
      descripcion: null,
      estadoSugerencia: null  /* ENUM */
    };
    this.submitted = false;
    this.displaySaveDialog = true;
  }

  cerrarDialog() {
    this.displaySaveDialog = false;
    this.submitted = false;
  }

  getAllSugerencias() {
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
            this.displaySaveDialog = false; // Cierra el modal
            this.getAllSugerencias();
          },
          error => {
            console.log(error);
          }
        )
      },
      error => {
        console.log(error);
      }
    )
  }

  /* ADMIN */
  getAllSugerenciasAdmin() {
    if (this.tokenService.getToken()) {
      this.sugerenciaService.getAll().subscribe(
        (result: any) => {
          let sugerenciasAdmin: Sugerencia[] = [];
          for (let i = 0; i < result.length; i++) {
            let sugerenciaAdmin = result[i] as Sugerencia;
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

  editarSugerenciaAdmin(sugerenciaAdmin: Sugerencia) {
    this.sugerenciaAdmin = { ...sugerenciaAdmin };
  }

  ngOnInit(): void {
    this.getAllSugerencias();
    this.getAllSugerenciasAdmin();
    this.cols = [
      { field: "nombre", header: "Título" },
      { field: "descripcion", header: "Descripción" }
    ];
    this.colsAdmin = [
      { field: "usuarioId", header: "Usuario" },
      { field: "nombre", header: "Título" },
      { field: "descripcion", header: "Descripción" }
    ];
  }

}
