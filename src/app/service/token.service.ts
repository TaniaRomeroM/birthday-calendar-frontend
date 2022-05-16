import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  constructor(
    private router: Router
  ) { }

  public setToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  public isLogged(): boolean {
    if(this.getToken()) {
      return true;
    }
    return false;
  }

  public getUsername(): string {
    if(!this.isLogged()) {
      return null;
    }
    const token = this.getToken();
    const payload = token.split('.')[1]; // Coger el 2º valor del token
    const payloadDecoded = atob(payload); // Decodificarlo
    const values = JSON.parse(payloadDecoded); // Convertirlo en JSON
    const username = values.sub;
    return username;
  }

  public isAdmin(): boolean {
    if(!this.isLogged()) {
      return false;
    }
    const token = this.getToken();
    const payload = token.split('.')[1];
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    const roles = values.roles;
    if(roles.indexOf('ROLE_ADMIN') < 0) { // Si ROLE_ADMIN esta en un array su posicion sera mayor de 0, y si no esta sera -1
      return false;
    }
    return true;
  }

  public logOut(): void {
    window.localStorage.clear();
    //this.router.navigate(['/']);
    window.location.reload();
  }
}
