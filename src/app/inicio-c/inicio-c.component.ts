import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { Contacto } from 'src/models/contacto';
import { MessageService } from 'primeng/api';
import { ContactoService } from '../service/contacto.service';
import { DatePipe } from '@angular/common';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-inicio-c',
  templateUrl: './inicio-c.component.html',
  styleUrls: ['./inicio-c.component.css']
})
export class InicioCComponent implements OnInit {

  constructor(private contactoService: ContactoService, private messageService: MessageService) { }

  displaySaveDialog: boolean = false; // Modal
  contactos: Contacto[];
  contacto: Contacto = {  // Modal de Nuevo Evento
    contactoId: null,
    usuarioId: null,
    nombre: null,
    apellido: null,
    fechanac: null,
    email: null
  };
  disabled: boolean = true; // Modal fechanac
  pipe = new DatePipe('es'); // Modal fechanac
  todayWithPipe = null; // Modal fechanac

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth listWeek'
    },
    dateClick: this.handleDateClick.bind(this), // bind es importante
    events: [
      { title: this.contacto.nombre, date: '2022-04-04' },
      { title: 'event 2', date: '2022-04-02' }
    ],
   // events:this.eventFromApiPush,
    locale: esLocale,
    aspectRatio: 2.5,

    showNonCurrentDates: false,
    fixedWeekCount: false
  };

  getAll() {
    /*this.contactoService.getAll(this.currentDateYear, this.currentDateMonth).subscribe(data  => {
      this.contactos = data as Contacto;
      this.contactos =  this.contactos[0];

      this.contactos.forEach(contacto => {
                 this.eventFromApiPush.push({
                   title: contacto.nombre,
                   start:this.startDate,
                   end: this.endDate,
                   extendedProps: {
                     id: contacto.id.toString()
                   },
               });
             });
*/
    this.contactoService.getAll().subscribe(
      (result: any) => {
        let contactos: Contacto[] = [];
        for (let i = 0; i < result.length; i++) {
          let contacto = result[i] as Contacto; // Convertir la variable contacto (que no tiene un tipo definido) en una variable de tipo Contacto
          contactos.push(contacto);
        }
        this.contactos = contactos;
        console.log(contactos);
      },
      error => {
        console.log(error);
      }
    );
  }

  handleDateClick(arg) { // Modal
    this.displaySaveDialog = true;
    this.contacto.fechanac =  arg.dateStr;
    this.todayWithPipe = this.pipe.transform(this.contacto.fechanac, 'dd/MM/yyyy'); // Formatea la fecha que obtiene del formulario Cumpleanyos
    this.contacto.fechanac = this.todayWithPipe;
  }

  addContacto() { // Modal
    this.todayWithPipe = this.pipe.transform(this.contacto.fechanac, 'dd/MM/yyyy'); // Formatea la fecha que obtiene del formulario Cumpleanyos
    this.contacto.fechanac = this.todayWithPipe;

    this.contactoService.addContacto(this.contacto).subscribe( // Procesos que surgan una vez se ha guardado el contacto
      (result:any) => {
        let contacto = result as Contacto;
        this.messageService.add({severity: 'succes', summary:"Resultado", detail: "Se guardó el evento correctamente."});
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
