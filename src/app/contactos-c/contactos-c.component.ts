import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Contacto } from 'src/models/contacto';
import { ContactoService } from '../service/contacto.service';

@Component({
  selector: 'app-contactos-c',
  templateUrl: './contactos-c.component.html',
  styleUrls: ['./contactos-c.component.css']
})
export class ContactosCComponent implements OnInit {

  contactos: Contacto[];
  cols: any[];
  items: MenuItem[];
  displaySaveDialog: boolean = false;
  contacto: Contacto = {  // Para el modal de Nuevo Contacto
    contactoId: null,
    usuarioId: null,
    nombre: null,
    apellido: null,
    fechanac: null,
    email: null
  };
  date: Date;

  constructor(private contactoService: ContactoService, private messageService: MessageService) { }

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
  showSaveDialog() {
    this.displaySaveDialog = true;
  }

  addContacto() {
    this.contactoService.addContacto(this.contacto).subscribe(
      (result:any) => {
        let contacto = result as Contacto;
        this.contactos.push(contacto); // Incluye automaticamente el contacto en la lista
        this.messageService.add({severity: 'succes', summary:"Resultado", detail: "Se guardó el contacto correctamente."});
        this.displaySaveDialog = false; // Cierra el modal

      },
      error => {
        console.log(error);
      }
    )
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

    this.items = [
      {
        label: "Nuevo",
        icon: 'pi pi-fw pi-plus',
        command: () => this.showSaveDialog()
      }
    ]
  }
}