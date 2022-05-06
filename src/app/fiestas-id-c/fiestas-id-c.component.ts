import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Fiesta } from 'src/models/fiesta';
import { FiestaService } from '../service/fiesta.service';
import { ContactoService } from '../service/contacto.service';
import { CompraService } from '../service/compra.service';
import { Contacto } from 'src/models/contacto';
import { Compra } from 'src/models/compra';
import { ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Invitado } from 'src/models/invitado';
import { InvitadoService } from '../service/invitado.service';

@Component({
  selector: 'app-fiestas-id-c',
  templateUrl: './fiestas-id-c.component.html',
  styleUrls: ['./fiestas-id-c.component.css']
})
export class FiestasIdCComponent implements OnInit {

  fiestaId: number;
  fiesta: Fiesta = {
    fiestaId: null,
    contactoId: null,
    usuarioId: null,
    fechaFiesta: null,
    tipo: null,
    nombreContacto: null
  }
  compras: Compra[];
  compra: Compra = {
    compraId: null,
    fiestaId: null,
    nombre: null
  }
  invitados: Invitado[];
  invitado: Invitado = {
    invitadoId: null,
    fiestaId: null,
    nombre: null
  }
  title: string; // dialogo Nueva Compra
  submitted: boolean;
  disabled: boolean = true;
  saveDialogCompras: boolean = false; // dialogo Nueva Compra
  saveDialogInvitados: boolean = false; // dialogo Nuevo Invitado
  pipe = new DatePipe('es');
  todayWithPipe = null;

  constructor(private router: Router, private route: ActivatedRoute, private fiestaService: FiestaService,
    private contactoService: ContactoService, private compraService: CompraService, private invitadoService: InvitadoService,
    private messageService: MessageService, private confirmationService: ConfirmationService) { }

  /* FIESTA */
  btnEditarFiesta() {
    this.disabled = false;
  }

  btnCancelar() {
    this.getFiesta();
    this.disabled = true;
  }

  getFiesta() {
    this.fiestaService.encontrarFiesta(this.fiestaId).subscribe(
      (result: any) => {
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

          this.fiesta = fiesta;
          this.getCompras();
          this.getInvitados();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  editarFiesta() {
    if (this.fiesta.fechaFiesta instanceof Date) {
      this.todayWithPipe = this.pipe.transform(this.fiesta.fechaFiesta, 'dd/MM/yyyy'); // Formatea la fecha que obtiene del formulario Cumpleanyos
      this.fiesta.fechaFiesta = this.todayWithPipe;
    }

    this.fiestaService.addFiesta(this.fiesta).subscribe( // Procesos que surgan una vez se ha guardado el contacto
      (result: any) => {
        let fiesta = result as Fiesta;
        this.fiesta = fiesta;
        this.messageService.add({ severity: 'success', summary: "Fiesta", detail: "Se han modificado los datos correctamente." });
        this.disabled = true;
      },
      error => {
        console.log(error);
      }
    )
  }

  eliminarFiesta(fiesta: Fiesta) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar la fiesta de ' + fiesta.nombreContacto + '?',
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.fiestaService.eliminarFiesta(fiesta.fiestaId).subscribe(
          (result: any) => {
            this.messageService.add({ severity: 'success', summary: 'Fiesta', detail: 'Fiesta eliminada con éxito', life: 3000 });
            this.router.navigate(['fiestas']);
          });
      }
    });
  }


  /* COMPRA */
  btnNuevaCompra() {
    this.compra = {
      compraId: null,
      fiestaId: null,
      nombre: null
    }
    this.title = "Nueva Compra";
    this.saveDialogCompras = true;
  }

  cerrarDialog() {
    if (this.saveDialogCompras = true) {
      this.saveDialogCompras = false;
    } else if (this.saveDialogInvitados = true) {
      this.saveDialogInvitados = false
    }
    this.submitted = false;
  }

  getCompras() {
    this.compraService.getAll(this.fiesta.fiestaId).subscribe(
      (result: any) => {
        let compras: Compra[] = [];
        for (let i = 0; i < result.length; i++) {
          let compra = result[i] as Compra; // Convertir la variable contacto (que no tiene un tipo definido) en una variable de tipo Contacto
          compras.push(compra);
        }
        this.compras = compras;
      },
      error => {
        console.log(error);
      }
    );
  }

  addCompra() {
    this.submitted = true;
    this.compra.fiestaId = this.fiesta.fiestaId;
    this.compraService.addCompra(this.compra).subscribe( // Procesos que surgan una vez se ha guardado el contacto
      (result: any) => {
        let compra = result as Compra;
        this.compras.push(compra);
        this.messageService.add({ severity: 'success', summary: "Productos", detail: "Se ha añadido el producto correctamente." });
        this.saveDialogCompras = false;
      },
      error => {
        console.log(error);
      }
    )
  }

  eliminarCompra(compra: Compra) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + compra.nombre + '?',
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.compraService.eliminarCompra(compra.compraId).subscribe(
          (result: any) => {
            this.messageService.add({ severity: 'success', summary: 'Compra', detail: 'Compra eliminada con éxito', life: 3000 });
            this.eliminarObjetoCompras(result.compraId);
          });
      }
    });
  }

  eliminarObjetoCompras(compraId: number) {
    let index = this.compras.findIndex((e) => e.compraId == compraId);
    if (index != -1) {
      this.compras.splice(index, 1);
    }
  }

  /* INVITADO */
  btnNuevoInvitado() {
    this.invitado = {
      invitadoId: null,
      fiestaId: null,
      nombre: null
    }
    this.title = "Nuevo Invitado";
    this.saveDialogInvitados = true;
  }

  getInvitados() {
    this.invitadoService.getAll(this.fiesta.fiestaId).subscribe(
      (result: any) => {
        let invitados: Invitado[] = [];
        for (let i = 0; i < result.length; i++) {
          let invitado = result[i] as Invitado; // Convertir la variable contacto (que no tiene un tipo definido) en una variable de tipo Contacto
          invitados.push(invitado);
        }
        this.invitados = invitados;
      },
      error => {
        console.log(error);
      }
    );
  }

  addInvitado() {
    this.submitted = true;
    this.invitado.fiestaId = this.fiesta.fiestaId;
    this.invitadoService.addInvitado(this.invitado).subscribe( // Procesos que surgan una vez se ha guardado el contacto
      (result: any) => {
        let invitado = result as Invitado;
        this.invitados.push(invitado);
        this.messageService.add({ severity: 'success', summary: "Invitados", detail: "Se ha añadido el invitado correctamente." });
        this.saveDialogInvitados = false;
      },
      error => {
        console.log(error);
      }
    )
  }

  eliminarInvitado(invitado: Invitado) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + invitado.nombre + '?',
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.invitadoService.eliminarInvitado(invitado.invitadoId).subscribe(
          (result: any) => {
            this.messageService.add({ severity: 'success', summary: 'Invitado', detail: 'Invitado eliminado con éxito', life: 3000 });
            this.eliminarObjetoInvitado(result.invitadoId);
          });
      }
    });
  }

  eliminarObjetoInvitado(invitadoId: number) {
    let index = this.invitados.findIndex((e) => e.invitadoId == invitadoId);
    if (index != -1) {
      this.invitados.splice(index, 1);
    }
  }

  ngOnInit(): void {
    this.fiestaId = this.route.snapshot.params['id']; // Asi recibe el Id enviado desde el componente 'fiestas-c'
    this.getFiesta();
  }
}
