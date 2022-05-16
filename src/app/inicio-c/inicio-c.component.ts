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
  contactosNotif: Contacto[];
  contacto: Contacto = {
    contactoId: null,
    usuarioId: null,
    nombre: null,
    apellido: null,
    fechanac: null,
    email: null,
    edad: null // Add para mostrar la edad que cumple
  };
  contactoNotif: Contacto = {
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
  valorNotif: number = null;

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
        //console.log("obteniendo todos los contactos");
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
            //console.log("obteniendo todas las fiestas");
            let fiestas: Fiesta[] = [];
            for (let i = 0; i < result.length; i++) {
              //console.log("fiesta obtenida: " + JSON.stringify(result[i]));
              let fiesta = result[i] as Fiesta;
              fiestas.push(fiesta);
            }
            //console.log("Fiestas" + JSON.stringify(fiestas));
            //this.fiestas = fiestas;
            //console.log("this.fiestas" + JSON.stringify(this.fiestas));

            for (let i = 0; i < fiestas.length; i++) {
              this.contactoService.encontrarContacto(fiestas[i].contactoId).subscribe(
                (result: any) => {
                  //console.log("obteniendo el contacto de la fiesta");
                  for (let j = 0; j < result.length; j++) {
                    //console.log("Result contacto asociado a fiesta " + JSON.stringify(result[j]));
                    let contacto = result[j] as Contacto; // Convertir la variable fiesta (que no tiene un tipo definido) en una variable de tipo Fiesta
                    fiestas[i].nombreContacto = contacto.nombre;

                    //Transformar f.fechaFiesta a formato yyyy-MM-dd para que pueda ser recogida por el calendario
                    //console.log("FECHA FIESTA: "+fiestas[i].fechaFiesta );
                    let fechaF = this.convertToDate(fiestas[i].fechaFiesta);
                    //console.log("FECHA FIESTA convertida: "+fechaF );
                    if (fechaF instanceof Date) {
                      //console.log("ENTRA");
                      this.todayWithPipe = this.pipe.transform(fechaF, 'yyyy-MM-dd');
                      fechaF = this.todayWithPipe;
                      //console.log("fechaF: "+fechaF );
                    }

                    this.eventFromApiPush.push({
                      title: " Fiesta de " + fiestas[i].tipo + " de " + fiestas[i].nombreContacto,
                      start: fechaF,
                      backgroundColor: 'rgb(231, 180, 70)',
                      borderColor: 'rgb(231, 180, 70)'
                    })
                    //console.log("this.eventFromApiPush Contactos fiestas " + JSON.stringify(this.eventFromApiPush));
                    //console.log("fiestas[i+1]" + (i + 1));
                    //console.log(fiestas[i+1]);
                    if (fiestas[i + 1] == null) {
                      //console.log("Entra en el if");
                      this.calendar();
                    }
                  }
                },
                error => {
                  console.log(error);
                }
              );
            }
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

  getContactosNotif() {
    if (this.tokenService.getToken()) {
      this.contactoService.getAllContactosNotif(this.tokenService.getUsername()).subscribe(
        (result: any) => {
          let contactosNotif: Contacto[] = [];
          for (let i = 0; i < result.length; i++) {
            let contactoNotif = result[i] as Contacto;
            this.valorNotif++;
            contactosNotif.push(contactoNotif);
          }
          this.contactosNotif = contactosNotif;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  ngOnInit(): void {
    this.getContactosNotif();
    this.getAll2();
  }


  getAll2() {
    if (this.tokenService.getToken()) {
      /* Recoger eventos Contactos */
      this.contactoService.getAll(this.tokenService.getUsername()).subscribe(result => {
        //console.log("obteniendo todos los contactos");
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
            if(result.length < 1) {
              this.calendar(); // Para que se pinten los eventos de Contactos si no hay fiestas
            }
            //console.log("obteniendo todas las fiestas");
            let fiestas: Fiesta[] = [];
            for (let i = 0; i < result.length; i++) {
              //console.log("fiesta obtenida: " + JSON.stringify(result[i]));
              let fiesta = result[i] as Fiesta;
              fiestas.push(fiesta);
            }

            //console.log("Fiestas" + JSON.stringify(fiestas));
            //this.fiestas = fiestas;
            //console.log("this.fiestas" + JSON.stringify(this.fiestas));

            for (let i = 0; i < fiestas.length; i++) {
              //Transformar f.fechaFiesta a formato yyyy-MM-dd para que pueda ser recogida por el calendario
              //console.log("FECHA FIESTA: "+fiestas[i].fechaFiesta );
              let fechaF = this.convertToDate(fiestas[i].fechaFiesta);
              //console.log("FECHA FIESTA convertida: "+fechaF );
              if (fechaF instanceof Date) {
                //console.log("ENTRA");
                this.todayWithPipe = this.pipe.transform(fechaF, 'yyyy-MM-dd');
                fechaF = this.todayWithPipe;
                //console.log("fechaF: "+fechaF );
              }
              var fiestaTypeTerm = (fiestas[i].tipo == null) ? ('') : (fiestas[i].tipo) // Si la fiesta no tiene tematica, saldria Fiesta null

              this.eventFromApiPush.push({
                title: " Fiesta " + fiestaTypeTerm,
                start: fechaF,
                backgroundColor: 'rgb(231, 180, 70)',
                borderColor: 'rgb(231, 180, 70)'
              })

              this.calendar();
            }
          }
        )
      },
        error => {
          console.log(error);
        }
      );
    }
  }
}
