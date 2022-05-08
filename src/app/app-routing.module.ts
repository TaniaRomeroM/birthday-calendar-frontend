import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegistroComponent } from './auth/registro.component';
import { ContactosCComponent } from './contactos-c/contactos-c.component';
import { ErrorPersonalizadoComponent } from './error-personalizado/error-personalizado.component';
import { FiestasCComponent } from './fiestas-c/fiestas-c.component';
import { FiestasIdCComponent } from './fiestas-id-c/fiestas-id-c.component';
import { InicioCComponent } from './inicio-c/inicio-c.component';
import { NotificacionesCComponent } from './notificaciones-c/notificaciones-c.component';
import { SugerenciasCComponent } from './sugerencias-c/sugerencias-c.component';
import { ProdGuardService } from './guards/prod-guard.service';
import { PerfilCComponent } from './perfil-c/perfil-c.component';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [ // Crear un objeto por cada ruta
  { path: '', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [LoginGuard] },
  { path: 'perfil', component: PerfilCComponent,  canActivate: [ProdGuardService], data: { expectedRol: ['admin', 'user'] } },
  { path: 'inicio', component: InicioCComponent, canActivate: [ProdGuardService], data: { expectedRol: ['admin', 'user'] } },
  { path: 'contactos', component: ContactosCComponent, canActivate: [ProdGuardService], data: { expectedRol: ['admin', 'user'] } },
  { path: 'fiestas', component: FiestasCComponent, canActivate: [ProdGuardService], data: { expectedRol: ['admin', 'user'] } },
  { path: 'fiestas/:id', component: FiestasIdCComponent, canActivate: [ProdGuardService], data: { expectedRol: ['admin', 'user'] } },
  { path: 'notificaciones', component: NotificacionesCComponent, canActivate: [ProdGuardService], data: { expectedRol: ['admin', 'user'] } },
  { path: 'sugerencias', component: SugerenciasCComponent, canActivate: [ProdGuardService], data: { expectedRol: ['admin', 'user'] } },
  { path: '**', component: ErrorPersonalizadoComponent } // Tienes que estar siempre el ultimo, Cualquier ruta que sea diferente a las anteriores ira aqui
  // si solo se permite administrador seria expectedRol: ['admin'] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
