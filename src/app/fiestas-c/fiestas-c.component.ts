import { Component, OnInit } from '@angular/core';
import { Fiesta } from 'src/models/fiesta';
import { FiestaService } from '../service/fiesta.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ContactoService } from '../service/contacto.service';
import { Contacto } from 'src/models/contacto';

@Component({
  selector: 'app-fiestas-c',
  templateUrl: './fiestas-c.component.html',
  styleUrls: ['./fiestas-c.component.css']
})
export class FiestasCComponent implements OnInit {

  fiestas: Fiesta[];
  fiesta: Fiesta = {  // Modal de Nuevo Contacto
    fiestaId: null,
    contactoId: null,
    usuarioId: null,
    fechaFiesta: null,
    tipo: null,
    nombreContacto: null,
    nombreCompra: null
  };
  cols: any[];
  displaySaveDialog: boolean = false;
  submitted: boolean;
  title: string;
  pipe = new DatePipe('es');
  todayWithPipe = null;

  constructor(private fiestaService: FiestaService, private messageService: MessageService, private contactoService: ContactoService) { }

  getAll() {
    this.fiestaService.getAll().subscribe(
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

  abrirModal() {
    this.fiesta = {
      fiestaId: null,
      contactoId: null,
      usuarioId: null,
      fechaFiesta: null,
      tipo: null,
      nombreContacto: null,
      nombreCompra: null
    };
    this.title = "Nueva Fiesta";
    this.submitted = false;
    this.displaySaveDialog = true;
  }

  addFiesta() {
    this.submitted = true;
    this.todayWithPipe = this.pipe.transform(this.fiesta.fechaFiesta, 'dd/MM/yyyy'); // Formatea la fecha que obtiene del formulario Cumpleanyos
    this.fiesta.fechaFiesta = this.todayWithPipe;

    this.fiestaService.addFiesta(this.fiesta).subscribe( // Procesos que surgan una vez se ha guardado el contacto
      (result:any) => {
        let fiesta = result as Fiesta;
        this.fiestas.push(fiesta); // Incluye automaticamente el contacto en la lista
        this.messageService.add({severity: 'succes', summary:"Resultado", detail: "Se guardó el contacto correctamente."});
        this.displaySaveDialog = false; // Cierra el modal
      },
      error => {
        console.log(error);
      }
    )
  }

  hideDialog() {
    this.displaySaveDialog = false;
    this.submitted = false;
  }

/*
  eliminarFiesta(fiesta: Fiesta) {
    this.confirmationService.confirm({
        message: '¿Estás seguro de que quieres eliminar la fiesta ' + contacto.nombre + '?',
        header: 'Eliminar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.fiestaService.eliminarFiesta(fiesta.fiestaId).subscribe(data => {
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Fiesta eliminada con éxito', life: 3000});
            });
        }
    });
  }
*/
  ngOnInit() {
    this.getAll();
    this.cols = [
      { field: "fiestaId", header: "ID Fiesta" },
      { field: "nombreContacto", header: "Nombre contacto" },
      { field: "contactoId", header: "ID Contacto" },
      { field: "usuarioId", header: "ID Usuario" },
      { field: "fechaFiesta", header: "Fecha de la Fiesta" },
      { field: "tipo", header: "Tipo" }
    ];
  }

}
