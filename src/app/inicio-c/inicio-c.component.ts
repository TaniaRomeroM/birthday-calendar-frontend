import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';

@Component({
  selector: 'app-inicio-c',
  templateUrl: './inicio-c.component.html',
  styleUrls: ['./inicio-c.component.css']
})
export class InicioCComponent implements OnInit {

  constructor() { }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this), // bind is important!
    events: [
      { title: 'event 1', date: '2022-04-01' },
      { title: 'event 2', date: '2022-04-02' }
    ]
  };
  
  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }

  ngOnInit(): void {
  }

}