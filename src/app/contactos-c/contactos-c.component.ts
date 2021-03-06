import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Contacto } from 'src/models/contacto';
import { ContactoService } from '../service/contacto.service';
import { ConfirmationService } from 'primeng/api';
import { TokenService } from '../service/token.service';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from 'src/models/usuario';
import { Fiesta } from 'src/models/fiesta';
import { FiestaService } from '../service/fiesta.service';
@Component({
  selector: 'app-contactos-c',
  templateUrl: './contactos-c.component.html',
  styleUrls: ['./contactos-c.component.css'],
  providers: [MessageService]
})
export class ContactosCComponent implements OnInit {

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
  fiesta: Fiesta = {
    fiestaId: null,
    contactoId: null,
    usuarioId: null,
    fechaFiesta: null,
    tipo: null,
    nombreContacto: null
  };
  cols: any[];
  title: string;
  items: MenuItem[];
  submitted: boolean;
  edit: boolean = false;
  checked: boolean = false;
  displaySaveDialog: boolean = false;
  pipe = new DatePipe('es');
  todayWithPipe = null;

  constructor(
    private contactoService: ContactoService,
    private usuarioService: UsuarioService,
    private fiestaService: FiestaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tokenService: TokenService
  ) { }

  abrirModal() {
    this.contacto = {
      contactoId: null,
      usuarioId: null,
      nombre: null,
      apellido: null,
      fechanac: null,
      email: null,
      edad: null
    };
    this.title = "Nuevo Contacto";
    this.submitted = false;
    this.displaySaveDialog = true;
  }

  cerrarDialog() {
    this.displaySaveDialog = false;
    this.submitted = false;
  }

  getAllContactos() {
    if (this.tokenService.getToken()) {
      this.contactoService.getAll(this.tokenService.getUsername()).subscribe(
        (result: any) => {
          let contactos: Contacto[] = [];
          for (let i = 0; i < result.length; i++) {
            let contacto = result[i] as Contacto; // Convertir la variable contacto (que no tiene un tipo definido) en una variable de tipo Contacto
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

  guardarContacto() {
    this.submitted = true;

    if (this.contacto.fechanac instanceof Date) {
      this.todayWithPipe = this.pipe.transform(this.contacto.fechanac, 'dd/MM/yyyy'); // Formatea la fecha que obtiene del formulario Cumpleanyos
      this.contacto.fechanac = this.todayWithPipe;
    }

    if (this.tokenService.getToken()) {

    this.usuarioService.getUsuarioByNombreUsuario(this.tokenService.getUsername()).subscribe( // Procesos que surgan una vez se ha guardado el contacto
      (result: any) => {
        let usuario = result as Usuario;
        this.contacto.usuarioId = usuario.usuarioId;
        this.contactoService.addContacto(this.contacto).subscribe( // Procesos que surgan una vez se ha guardado el contacto
          (result: any) => {
            let contacto = result as Contacto;
            if (this.edit) {
              this.contactos[this.findIndexById(this.contacto.contactoId)] = this.contacto;
            }
            this.messageService.add({ severity: 'success', summary: "Nuevo contacto", detail: "Se guard?? el contacto correctamente." });
            this.displaySaveDialog = false; // Cierra el modal
            this.getAllContactos();

            /* CREAR FIESTA */
            if (this.checked === true) {
              this.fiesta.contactoId = contacto.contactoId;
              this.fiesta.usuarioId = usuario.usuarioId;
              this.fiestaService.addFiesta(this.fiesta).subscribe( // Procesos que surgan una vez se ha guardado el contacto
                (result: any) => {
                  let fiesta = result as Fiesta;
                }, error => {
                  console.log(error);
                }
              )
              this.checked = false;
            }
          },
          error => {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el contacto: ' + error.error.message });
          }
        )
      },
      error => {
        console.log(error);
      }
    )
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.contactos.length; i++) {
      if (this.contactos[i].contactoId === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  editarContacto(contacto: Contacto) {
    this.edit = true;
    this.title = "Editar Contacto";
    this.contacto = { ...contacto };
    this.displaySaveDialog = true;
  }

  eliminarContacto(contacto: Contacto) {
    if (this.tokenService.getToken()) {
      this.confirmationService.confirm({
        message: '??Est??s seguro de que quieres eliminar a ' + contacto.nombre + '?',
        header: 'Eliminar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.contactoService.eliminarContacto(contacto.contactoId).subscribe(
            (result: any) => {
              this.messageService.add({ severity: 'success', summary: 'Contacto', detail: 'Contacto eliminado con ??xito', life: 3000 });
              this.eliminarObjeto(result.contactoId);
            });
        }
      });
    }
  }

  eliminarObjeto(contactoId: number) {
    let index = this.contactos.findIndex((e) => e.contactoId == contactoId);
    if (index != -1) {
      this.contactos.splice(index, 1);
    }
  }

  ngOnInit() { // Se ejecuta su interior cuando se cargue el componente por primera vez
    this.getAllContactos();
    this.cols = [
      { field: "apellido", header: "Apellido" },
      { field: "fechanac", header: "Fecha de Cumplea??os" },
      { field: "email", header: "Email" }
    ];
  }
}
