import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { Contacto } from 'src/models/contacto';
import { MessageService } from 'primeng/api';
import { ContactoService } from '../service/contacto.service';
import { DatePipe } from '@angular/common';
import esLocale from '@fullcalendar/core/locales/es';
import { TokenService } from '../service/token.service';
import { FiestaService } from '../service/fiesta.service';
import { Fiesta } from 'src/models/fiesta';
import { reduce } from 'rxjs';

@Component({
  selector: 'app-inicio-c',
  templateUrl: './inicio-c.component.html',
  styleUrls: ['./inicio-c.component.css']
})
export class InicioCComponent implements OnInit {

  contactos: Contacto[];
  contacto: Contacto = {
    contactoId: null,
    usuarioId: null,
    nombre: null,
    apellido: null,
    fechanac: null,
    email: null,
    edad: null // Add para mostrar la edad que cumple
  };
  fiestas: Fiesta[];
  fiesta: Fiesta = {
    fiestaId: null,
    contactoId: null,
    usuarioId: null,
    fechaFiesta: null,
    tipo: null,
    nombreContacto: null
  };
  eventFromApiPush: any[] = []; // Recoger eventos
  calendarOptions: CalendarOptions;
  disabled: boolean = true; // Modal fechanac
  displaySaveDialog: boolean = false; // Modal
  pipe = new DatePipe('es'); // Modal fechanac
  todayWithPipe = null; // Modal fechanac

  constructor(
    private contactoService: ContactoService,
    private fiestaService: FiestaService,
    private messageService: MessageService,
    private tokenService: TokenService
  ) { }

  getAll() {
    if (this.tokenService.getToken()) {
      /*console.log("TOKEN" + this.tokenService.getToken());
      console.log("USERNAME" + this.tokenService.getUsername());*/

      /* Recoger eventos Contactos */
      this.contactoService.getAll(this.tokenService.getUsername()).subscribe(result => {

        let contactos: Contacto[] = [];
        for (let i = 0; i < result.length; i++) {
          let contacto = result[i] as Contacto; // Convertir la variable contacto (que no tiene un tipo definido) en una variable de tipo Contacto
          contacto.edad = this.calcularEdad(contacto.fechanac); // Calcular cuantos anyos cumple el Contacto
          contactos.push(contacto);
        }
        this.contactos = contactos;

        this.contactos.forEach(c => {
          //Transformar c.fechanac a formato yyyy-MM-dd para que pueda ser recogida por el calendario
          let fechaNacimiento = this.convertToDate(c.fechanac);
          if (fechaNacimiento instanceof Date) {
            this.todayWithPipe = this.pipe.transform(fechaNacimiento, 'yyyy-MM-dd'); // Formatea la fecha que obtiene del formulario Cumpleanyos
            fechaNacimiento = this.todayWithPipe;
          }
          //console.log("ENTRA 1 ");
          this.eventFromApiPush.push({
            title: c.nombre + " - Cumple " + c.edad + " años",
            start: fechaNacimiento,
            rrule: {
              freq: 'yearly',
              dtstart: fechaNacimiento,
              until: '2032-01-01'
            }
          })
          //console.log("this.eventFromApiPush Contactos " + JSON.stringify(this.eventFromApiPush));
        })

        /* Recoger eventos Fiestas */
        this.fiestaService.getAll(this.tokenService.getUsername()).subscribe(
          (result: any) => {
            let fiestas: Fiesta[] = [];
            for (let i = 0; i < result.length; i++) {
              let fiesta = result[i] as Fiesta;

              this.contactoService.encontrarContacto(fiesta.contactoId).subscribe(
                (result: any) => {
                  for (let i = 0; i < result.length; i++) {
                    let contacto = result[i] as Contacto; // Convertir la variable fiesta (que no tiene un tipo definido) en una variable de tipo Fiesta
                    fiesta.nombreContacto = contacto.nombre;
                    //console.log("ENTRA 2 ");
                    //console.log("fiesta.nombreContacto " + JSON.stringify(fiesta.nombreContacto));
                    //console.log("this.fiestas encontrarContacto() " + JSON.stringify(this.fiestas));
                  }
                },
                error => {
                  console.log(error);
                }
              );

              fiestas.push(fiesta);
            }
            this.fiestas = fiestas;

            this.fiestas.forEach(f => {
              //console.log("ENTRA 3 ");
              //console.log("this.fiestas " + JSON.stringify(this.fiestas));
              //Transformar f.fechaFiesta a formato yyyy-MM-dd para que pueda ser recogida por el calendario
              let fechaF = this.convertToDate(f.fechaFiesta);
              if (fechaF instanceof Date) {
                this.todayWithPipe = this.pipe.transform(fechaF, 'yyyy-MM-dd');
                fechaF = this.todayWithPipe;
              }
              //console.log("fechaF " + JSON.stringify(fechaF));
              //console.log("f.nombreContacto forEach " + JSON.stringify(f.nombreContacto));
              this.eventFromApiPush.push({
                title: " Fiesta de " + f.contactoId,
                start: fechaF,
                backgroundColor: 'rgb(231, 180, 70)',
                borderColor: 'rgb(231, 180, 70)'
              })
              this.calendar();
              //console.log("this.eventFromApiPush Fiestas " + JSON.stringify(this.eventFromApiPush));
            })
          }
        )



      },
        error => {
          console.log(error);
        }
      );
    }
  }

  calendar() {
    this.calendarOptions = {
      initialView: 'dayGridMonth', // La vista inicial cuando se carga el calendario, mensual
      headerToolbar: {
        left: 'prevYear,prev,next,nextYear today',
        center: 'title',
        right: 'dayGridMonth listWeek'
      },
      events: this.eventFromApiPush,
      titleFormat: { year: 'numeric', month: 'long' },
      dayHeaderFormat: { weekday: 'long' }, // Determina que se muestre el texto del dia completo
      eventColor: 'rgb(80, 160, 127)',
      locale: esLocale,
      aspectRatio: 2.5, // Establece la relacion de aspecto ancho-alto del calendario
      showNonCurrentDates: false, // Con false no se ven las fechas de los meses anteriores/posteriores
      fixedWeekCount: false // Determina el número de semanas que se muestran en una vista de mes, si es falso, se ajuntan al mes
    };
    //console.log("this.calendarOptions " + JSON.stringify(this.calendarOptions))
  }

  convertToDate(dateString) {
    // Convertir un string "dd/MM/yyyy" a un objeto Date
    let d = dateString.split("/");
    let dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;
  }

  calcularEdad(fecha) {
    let hoy = new Date();
    let cumpleanos = new Date(this.convertToDate(fecha)); // Convertir la fecha recibida a "dd/MM/yyyy", porque new Date lo capta como "MM/dd/yyyy"
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    return edad;
  }
  /*
    addContacto() { // Modal
      if (this.tokenService.getToken()) {
        this.todayWithPipe = this.pipe.transform(this.contacto.fechanac, 'dd/MM/yyyy'); // Formatea la fecha que obtiene del formulario Cumpleanyos
        this.contacto.fechanac = this.todayWithPipe;

        this.contactoService.addContacto(this.contacto).subscribe( // Procesos que surgan una vez se ha guardado el contacto
          (result: any) => {
            let contacto = result as Contacto;
            this.messageService.add({ severity: 'succes', summary: "Resultado", detail: "Se guardó el evento correctamente." });
            this.displaySaveDialog = false; // Cierra el modal
          },
          error => {
            console.log(error);
          }
        )
      }
    }*/

  ngOnInit(): void {
    this.getAll();
  }
}
