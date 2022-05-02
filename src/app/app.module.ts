import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
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
import { SplitterModule } from 'primeng/splitter';
import { DividerModule } from 'primeng/divider';  // Quitar
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';

import { CalendarModule } from 'primeng/calendar';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // plugin
import interactionPlugin from '@fullcalendar/interaction'; // plugin
import listPlugin from '@fullcalendar/list'; // plugin
import rrulePlugin from '@fullcalendar/rrule'; // plugin
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';

import { InicioCComponent } from './inicio-c/inicio-c.component';
import { ContactosCComponent } from './contactos-c/contactos-c.component';
import { FiestasCComponent } from './fiestas-c/fiestas-c.component';
import { NotificacionesCComponent } from './notificaciones-c/notificaciones-c.component';
import { SugerenciasCComponent } from './sugerencias-c/sugerencias-c.component';
import { ErrorPersonalizadoComponent } from './error-personalizado/error-personalizado.component';
import { FiestasIdCComponent } from './fiestas-id-c/fiestas-id-c.component';
import { LoginComponent } from './auth/login.component';
import { RegistroComponent } from './auth/registro.component';
import { PerfilCComponent } from './perfil-c/perfil-c.component';

registerLocaleData(localeEs, 'es');

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  listPlugin,
  rrulePlugin
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
    LoginComponent,
    RegistroComponent,
    PerfilCComponent,
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
    DividerModule,     // Quitar
    AutoCompleteModule,
    CardModule,
    MatGridListModule,
    AccordionModule,
    InputSwitchModule,
    SplitButtonModule,
    InputTextareaModule,
    KeyFilterModule
  ],
  providers: [MessageService, ConfirmationService, { provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
