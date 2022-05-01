import { Component, OnInit } from '@angular/core';
import { Fiesta } from 'src/models/fiesta';
import { FiestaService } from '../service/fiesta.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ContactoService } from '../service/contacto.service';
import { Contacto } from 'src/models/contacto';
import { ConfirmationService } from 'primeng/api';
import { TokenService } from '../service/token.service';

@Component({
  selector: 'app-fiestas-c',
  templateUrl: './fiestas-c.component.html',
  styleUrls: ['./fiestas-c.component.css']
})
export class FiestasCComponent implements OnInit {

  fiestas: Fiesta[];
  fiesta: Fiesta = {  // Modal de Nueva Fiesta
    fiestaId: null,
    contactoId: null,
    usuarioId: null,
    fechaFiesta: null,
    tipo: null,
    nombreContacto: null
  };
  contactos: Contacto[];
  contactosDropdown: any[];
  contacto: Contacto = {  // Modal de Nueva Fiesta
    contactoId: null,
    usuarioId: null,
    nombre: null,
    apellido: null,
    fechanac: null,
    email: null,
    edad: null
  };
  cols: any[];
  title: string;
  submitted: boolean;
  displaySaveDialog: boolean = false;
  pipe = new DatePipe('es');
  todayWithPipe = null;

  constructor(private fiestaService: FiestaService, private messageService: MessageService, private contactoService: ContactoService, private confirmationService: ConfirmationService, private tokenService: TokenService) { }

  abrirModal() {
    this.fiesta = {
      fiestaId: null,
      contactoId: null,
      usuarioId: null,
      fechaFiesta: null,
      tipo: null,
      nombreContacto: null
    };
    this.contacto = {
      contactoId: null,
      usuarioId: null,
      nombre: null,
      apellido: null,
      fechanac: null,
      email: null,
      edad: null
    };
    this.title = "Nueva Fiesta";
    this.submitted = false;
    this.displaySaveDialog = true;
  }

  cerrarDialog() {
    this.displaySaveDialog = false;
    this.submitted = false;
  }

  getAllFiestas() {
    this.fiestaService.getAll(this.tokenService.getUsername()).subscribe(
      (result: any) => {
        let fiestas: Fiesta[] = [];
        for (let i = 0; i < result.length; i++) {
          let fiesta = result[i] as Fiesta; // Convertir la variable fiesta (que no tiene un tipo definido) en una variable de tipo Fiesta

          this.contactoService.encontrarContacto(fiesta.contactoId).subscribe(
            (result: any) => {
              for (let i = 0; i < result.length; i++) {
                let contacto = result[i] as Contacto; // Convertir la variable fiesta (que no tiene un tipo definido) en una variable de tipo Fiesta
                fiesta.nombreContacto = contacto.nombre;
              }
            },
            error => {
              console.log(error);
            }
          );

          fiestas.push(fiesta);
        }
        this.fiestas = fiestas;
      },
      error => {
        console.log(error);
      }
    );
  }

  getAllContactos(event) {
    let query = event.query;
    if (this.tokenService.getToken()) {
      console.log("TOKEN" + this.tokenService.getToken());
      console.log("USERNAME" + this.tokenService.getUsername());

      this.contactoService.getAll(this.tokenService.getUsername()).subscribe(
        (result: any) => {
          let contactos: Contacto[] = [];
          for (let i = 0; i < result.length; i++) {
            let contacto = result[i] as Contacto; // Convertir la variable contacto (que no tiene un tipo definido) en una variable de tipo Contacto
            contactos.push(contacto);
          }
          this.contactosDropdown = contactos;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  addFiesta() {
    this.submitted = true;
    if (this.fiesta.fechaFiesta instanceof Date) {
      this.todayWithPipe = this.pipe.transform(this.fiesta.fechaFiesta, 'dd/MM/yyyy'); // Formatea la fecha que obtiene del formulario Cumpleanyos
      this.fiesta.fechaFiesta = this.todayWithPipe;
    }
    console.log("contacto nombre " + this.contacto.nombre);
    console.log("contacto id " + this.contacto.contactoId);
    console.log("fiesta id " + this.fiesta.fiestaId);
    /*  IGUALAR contacto.contactoId   A   fiesta.contactoId  */
    //this.fiesta.contactoId = this.contacto.contactoId;

    this.fiestaService.addFiesta(this.fiesta).subscribe( // Procesos que surgan una vez se ha guardado el contacto
      (result: any) => {
        let fiesta = result as Fiesta;
        this.fiestas.push(fiesta);
        this.messageService.add({ severity: 'success', summary: "Nueva Fiesta", detail: "Se guardó la fiesta correctamente." });
        this.displaySaveDialog = false; // Cierra el modal
      },
      error => {
        console.log(error);
      }
    )
  }

  eliminarFiesta(fiesta: Fiesta) {
    console.log("fiesta " + fiesta)
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar la fiesta de ' + fiesta.nombreContacto + '?',
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.fiestaService.eliminarFiesta(fiesta.fiestaId).subscribe(
          (result: any) => {
            this.messageService.add({ severity: 'success', summary: 'Fiesta', detail: 'Fiesta eliminada con éxito', life: 3000 });
            this.eliminarObjeto(result.fiestaId);
          });
      }
    });
  }

  eliminarObjeto(fiestaId: number) {
    let index = this.fiestas.findIndex((e) => e.fiestaId == fiestaId);
    if (index != -1) {
      this.fiestas.splice(index, 1);
    }
  }

  ngOnInit() {
    this.getAllFiestas();
    this.cols = [
      { field: "nombreContacto", header: "Nombre contacto" },
      { field: "fechaFiesta", header: "Fecha de la Fiesta" },
      { field: "tipo", header: "Tipo" }
    ];
  }

}
