import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegistroComponent } from './auth/registro.component';
import { ContactosCComponent } from './contactos-c/contactos-c.component';
import { ErrorPersonalizadoComponent } from './error-personalizado/error-personalizado.component';
import { FiestasCComponent } from './fiestas-c/fiestas-c.component';
import { FiestasIdCComponent } from './fiestas-id-c/fiestas-id-c.component';
import { InicioCComponent } from './inicio-c/inicio-c.component';
import { MenuCComponent } from './menu-c/menu-c.component';
import { NotificacionesCComponent } from './notificaciones-c/notificaciones-c.component';
import { SugerenciasCComponent } from './sugerencias-c/sugerencias-c.component';
import { ProdGuardService as guard } from './guards/prod-guard.service';
import { PerfilCComponent } from './perfil-c/perfil-c.component';

const routes: Routes = [ // Crear un objeto por cada ruta
  { path: '', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: PerfilCComponent },
  //{ path: 'menu', component: MenuCComponent },
  { path: 'inicio', component: InicioCComponent, canActivate: [guard], data: { expectedRol: ['admin', 'user'] } },
  { path: 'contactos', component: ContactosCComponent, canActivate: [guard], data: { expectedRol: ['admin', 'user'] } },
  { path: 'fiestas', component: FiestasCComponent, canActivate: [guard], data: { expectedRol: ['admin', 'user'] } },
  { path: 'fiestas/:id', component: FiestasIdCComponent, canActivate: [guard], data: { expectedRol: ['admin', 'user'] } },
  { path: 'notificaciones', component: NotificacionesCComponent, canActivate: [guard], data: { expectedRol: ['admin', 'user'] } },
  { path: 'sugerencias', component: SugerenciasCComponent, canActivate: [guard], data: { expectedRol: ['admin', 'user'] } },
  { path: '**', component: ErrorPersonalizadoComponent } // Tienes que estar siempre el ultimo, Cualquier ruta que sea diferente a las anteriores ira aqui
  // si solo se permite administrador seria expectedRol: ['admin'] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
