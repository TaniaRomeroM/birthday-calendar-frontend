import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { Contacto } from 'src/models/contacto';
import { MessageService } from 'primeng/api';
import { ContactoService } from '../service/contacto.service';
import { DatePipe } from '@angular/common';
import esLocale from '@fullcalendar/core/locales/es';
import { TokenService } from '../service/token.service';

@Component({
  selector: 'app-inicio-c',
  templateUrl: './inicio-c.component.html',
  styleUrls: ['./inicio-c.component.css']
})
export class InicioCComponent implements OnInit {

  contactos: Contacto[];
  contacto: Contacto = {  // Modal de Nuevo Evento
    contactoId: null,
    usuarioId: null,
    nombre: null,
    apellido: null,
    fechanac: null,
    email: null,
    edad: null
  };
  eventFromApiPush: any[] = []; // Recoger eventos
  calendarOptions: CalendarOptions;
  disabled: boolean = true; // Modal fechanac
  displaySaveDialog: boolean = false; // Modal
  pipe = new DatePipe('es'); // Modal fechanac
  todayWithPipe = null; // Modal fechanac

  constructor(
    private contactoService: ContactoService,
    private messageService: MessageService,
    private tokenService: TokenService
  ) { }

  getAll() {
    if (this.tokenService.getToken()) {
      console.log("TOKEN" + this.tokenService.getToken());
      console.log("USERNAME" + this.tokenService.getUsername());
      this.contactoService.getAll(this.tokenService.getUsername()).subscribe(result => {

        let contactos: Contacto[] = [];
        for (let i = 0; i < result.length; i++) {
          let contacto = result[i] as Contacto; // Convertir la variable contacto (que no tiene un tipo definido) en una variable de tipo Contacto
          contacto.edad = this.calcularEdad(contacto.fechanac); // Calcular cuantos anyos cumple el Contacto
          contactos.push(contacto);
        }
        this.contactos = contactos;

        this.contactos.forEach(c => {
          //Transformar c.fechanac a formato yyyy-MM-dd
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
        })

        this.calendarOptions = {
          initialView: 'dayGridMonth',
          headerToolbar: {
            left: 'prevYear,prev,next,nextYear today',
            center: 'title',
            right: 'dayGridMonth listWeek'
          },
          events: this.eventFromApiPush,
          titleFormat: { year: 'numeric', month: 'long' },
          dayHeaderFormat: { weekday: 'long' },
          //dateClick: this.handleDateClick.bind(this), // Para mostrar el modal y añadir un evento
          eventColor: 'rgb(160, 228, 200)',
          locale: esLocale,
          aspectRatio: 2.5,
          showNonCurrentDates: false,
          fixedWeekCount: false
        };
      },
        error => {
          console.log(error);
        }
      );
    }
  }

  convertToDate(dateString) {
    // Convertir un string "dd/MM/yyyy" a un objeto Date
    let d = dateString.split("/");
    let dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;
  }

  /*handleDateClick(arg) { // Modal
    this.displaySaveDialog = true;
    this.contacto.fechanac = arg.dateStr;
    this.todayWithPipe = this.pipe.transform(this.contacto.fechanac, 'dd/MM/yyyy'); // Formatea la fecha que obtiene del formulario Cumpleanyos
    this.contacto.fechanac = this.todayWithPipe;
  }*/

  calcularEdad(fecha) {
    let hoy = new Date();
    let cumpleanos = new Date(this.convertToDate(fecha)); // Convertir la fecha recibida a "dd/MM/yyyy", porque new Date lo capta como "MM/dd/yyyy"
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    return edad;
  }

  addContacto() { // Modal
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

  ngOnInit(): void {
    this.getAll();
  }
}
