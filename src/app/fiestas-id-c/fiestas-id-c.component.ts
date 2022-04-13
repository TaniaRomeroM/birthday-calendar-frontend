import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Fiesta } from 'src/models/fiesta';
import { FiestaService } from '../service/fiesta.service';
import { ContactoService } from '../service/contacto.service';
import { Contacto } from 'src/models/contacto';

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
    nombreContacto: null,
    nombreCompra: null
  }
  disabled: boolean = true;
  cols: any[];

  constructor(private route: ActivatedRoute, private fiestaService: FiestaService, private messageService: MessageService, private contactoService: ContactoService) { }

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

          /* Poner getCompras();*/

          this.fiesta = fiesta;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  btnEditarFiesta() {
    this.disabled = false;
  }

  btonCancelar() {
    this.disabled = true;
  }

  editarFiesta() {
    /*this.todayWithPipe = this.pipe.transform(this.fiesta.fechaFiesta, 'dd/MM/yyyy'); // Formatea la fecha que obtiene del formulario Cumpleanyos
    this.fiesta.fechaFiesta = this.todayWithPipe;*/
    this.fiestaService.addFiesta(this.fiesta).subscribe( // Procesos que surgan una vez se ha guardado el contacto
      (result:any) => {
        let fiesta = result as Fiesta;
        this.fiesta = fiesta;
        this.messageService.add({severity: 'succes', summary:"Resultado", detail: "Se guardó el contacto correctamente."});
        this.disabled = true;
      },
      error => {
        console.log(error);
      }
    )
  }

  ngOnInit(): void {
    this.fiestaId = this.route.snapshot.params['id']; // Asi recibe el Id enviado desde el componente 'fiestas-c'
    this.getFiesta();
  }

}
