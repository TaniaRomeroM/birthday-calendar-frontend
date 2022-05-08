import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/* Se almacenaran en session storage */
const TOKEN_KEY = 'AuthToken';
/*const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';*/

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

  /*public setUsername(userName: string): void {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, userName);
  }*/

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

  /*public setAuthorites(authorities: string[]): void {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities)); // se pasa como json al ser un array
  }*/

  /*public getAuthorities(): string[] {
    this.roles = [];
    console.log("Entra en getAuthorities");
    if (sessionStorage.getItem(AUTHORITIES_KEY)) {
      console.log("Entra en if" + sessionStorage.getItem(AUTHORITIES_KEY));
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
        console.log(authority.authority);
        this.roles.push(authority.authority)
      });
    }
    console.log("Roles " + this.roles);
    return this.roles;
  }*/

  public logOut(): void {
    window.localStorage.clear();
    this.router.navigate(['/']);
  }
}
