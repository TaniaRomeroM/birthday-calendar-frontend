import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Contacto } from 'src/models/contacto';
import { ContactoService } from '../service/contacto.service';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-contactos-c',
  templateUrl: './contactos-c.component.html',
  styleUrls: ['./contactos-c.component.css']
})
export class ContactosCComponent implements OnInit {

  cols: any[];
  title: string;
  items: MenuItem[];
  displaySaveDialog: boolean = false;
  submitted: boolean;
  edit: boolean = false;
  contactos: Contacto[];
  contacto: Contacto = {  // Modal de Nuevo Contacto
    contactoId: null,
    usuarioId: null,
    nombre: null,
    apellido: null,
    fechanac: null,
    email: null
  };
  pipe = new DatePipe('es');
  todayWithPipe = null;

  constructor(private contactoService: ContactoService, private messageService: MessageService,
    private confirmationService: ConfirmationService) { }


  abrirModalNuevo() {
    this.contacto = {
      contactoId: null,
      usuarioId: null,
      nombre: null,
      apellido: null,
      fechanac: null,
      email: null
    };
    this.title = "Nuevo Contacto";
    this.submitted = false;
    this.displaySaveDialog = true;
  }

  hideDialog() {
    this.displaySaveDialog = false;
    this.submitted = false;
  }

  getAll() {
    this.contactoService.getAll().subscribe(
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

  saveContacto() {
    this.submitted = true;
    /*if(this.contacto.fechanac instanceof Date){
      console.log("I'm a date " + this.contacto.fechanac);
    } else {
    console.log("I'm not a date " + this.contacto.fechanac);
    }*/
    if (this.contacto.fechanac instanceof Date) {
      this.todayWithPipe = this.pipe.transform(this.contacto.fechanac, 'dd/MM/yyyy'); // Formatea la fecha que obtiene del formulario Cumpleanyos
      this.contacto.fechanac = this.todayWithPipe;
    }

    this.contactoService.addContacto(this.contacto).subscribe( // Procesos que surgan una vez se ha guardado el contacto
      (result: any) => {
        let contacto = result as Contacto;
        if (this.edit) {
          this.contactos[this.findIndexById(this.contacto.contactoId)] = this.contacto;
        } /*else {
          this.contactos.push(contacto); // Incluye automaticamente el contacto en la lista
        }*/
        this.messageService.add({ severity: 'succes', summary: "Resultado", detail: "Se guardó el contacto correctamente." });
        this.displaySaveDialog = false; // Cierra el modal

        this.getAll();
      },
      error => {
        console.log(error);
      }
    )
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
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar a ' + contacto.nombre + '?',
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.contactoService.eliminarContacto(contacto.contactoId).subscribe(
          (result: any) => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Contacto eliminado con éxito', life: 3000 });
            this.eliminarObjeto(result.contactoId);
          });
      }
    });
  }

  eliminarObjeto(contactoId: number) {
    let index = this.contactos.findIndex((e) => e.contactoId == contactoId);
    if (index != -1) {
      this.contactos.splice(index, 1);
    }
  }

  ngOnInit() { // Se ejecuta su interior cuando se cargue el componente por primera vez
    this.getAll();
    this.cols = [
      { field: "contactoId", header: "ID Contacto" },
      { field: "usuarioId", header: "ID Usuario" },
      { field: "nombre", header: "Nombre" },
      { field: "apellido", header: "Apellido" },
      { field: "fechanac", header: "Fecha de Cumpleaños" },
      { field: "email", header: "Email" }
    ];
  }
}
