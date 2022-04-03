import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlideMenuModule } from 'primeng/slidemenu';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ContactosCComponent } from './contactos-c/contactos-c.component';
import { RouterModule, Routes } from '@angular/router';
import { InicioCComponent } from './inicio-c/inicio-c.component';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // plugin
import interactionPlugin from '@fullcalendar/interaction'; // plugin

import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './fiestas-c/productservice';
import { TableModule } from 'primeng/table';
import { FiestasCComponent } from './fiestas-c/fiestas-c.component';
import { NotificacionesCComponent } from './notificaciones-c/notificaciones-c.component';
import { SugerenciasCComponent } from './sugerencias-c/sugerencias-c.component';
import { ErrorPersonalizadoComponent } from './error-personalizado/error-personalizado.component';
import { MessageService } from 'primeng/api';

const appRoutes: Routes = [ // Crear un objeto por cada ruta
  { path: '', component: InicioCComponent },
  { path: 'inicio', component: InicioCComponent },
  { path: 'contactos', component: ContactosCComponent },
  { path: 'fiestas', component: FiestasCComponent },
  { path: 'notificaciones', component: NotificacionesCComponent },
  { path: 'sugerencias', component: SugerenciasCComponent },
  { path: '**', component: ErrorPersonalizadoComponent } // Tienes que estar siempre el ultimo, Cualquier ruta que sea diferente a las anteriores ira aqui
];

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    ContactosCComponent,
    InicioCComponent,
    FiestasCComponent,
    NotificacionesCComponent,
    SugerenciasCComponent,
    ErrorPersonalizadoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlideMenuModule,
    FormsModule,
    ButtonModule,
    BrowserAnimationsModule,
    MenubarModule,
    InputTextModule,
    TabViewModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    HttpClientModule,
    TableModule,
    PanelModule,
    DialogModule,
    ToastModule,
    FullCalendarModule,
    CalendarModule,
    RouterModule.forRoot(appRoutes) // Para indicar que quiero utilizar esa contante (appRoutes) en la app para enroutar los componentes
  ],
  providers: [ProductService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
