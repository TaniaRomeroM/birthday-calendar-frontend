import { LOCALE_ID,NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';

import { FormsModule } from '@angular/forms';
import { SlideMenuModule } from 'primeng/slidemenu';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {SplitterModule} from 'primeng/splitter';
import {DividerModule} from 'primeng/divider';

import { CalendarModule } from 'primeng/calendar';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // plugin
import interactionPlugin from '@fullcalendar/interaction'; // plugin
import listPlugin from '@fullcalendar/list'; // plugin
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

import { InicioCComponent } from './inicio-c/inicio-c.component';
import { ContactosCComponent } from './contactos-c/contactos-c.component';
import { FiestasCComponent } from './fiestas-c/fiestas-c.component';
import { NotificacionesCComponent } from './notificaciones-c/notificaciones-c.component';
import { SugerenciasCComponent } from './sugerencias-c/sugerencias-c.component';
import { ErrorPersonalizadoComponent } from './error-personalizado/error-personalizado.component';
import { FiestasIdCComponent } from './fiestas-id-c/fiestas-id-c.component';

registerLocaleData(localeEs, 'es');

const appRoutes: Routes = [ // Crear un objeto por cada ruta
  { path: '', component: InicioCComponent },
  { path: 'inicio', component: InicioCComponent },
  { path: 'contactos', component: ContactosCComponent },
  { path: 'fiestas', component: FiestasCComponent },
  { path: 'fiestas/:id', component: FiestasIdCComponent },
  { path: 'notificaciones', component: NotificacionesCComponent },
  { path: 'sugerencias', component: SugerenciasCComponent },
  { path: '**', component: ErrorPersonalizadoComponent } // Tienes que estar siempre el ultimo, Cualquier ruta que sea diferente a las anteriores ira aqui
];

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  listPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    InicioCComponent,
    ContactosCComponent,
    FiestasCComponent,
    NotificacionesCComponent,
    SugerenciasCComponent,
    ErrorPersonalizadoComponent,
    FiestasIdCComponent,
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
    ConfirmDialogModule,
    SplitterModule,
    DividerModule,
    RouterModule.forRoot(appRoutes) // Para indicar que quiero utilizar esa contante (appRoutes) en la app para enroutar los componentes
  ],
  providers: [MessageService, ConfirmationService, { provide: LOCALE_ID, useValue: 'es'} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
