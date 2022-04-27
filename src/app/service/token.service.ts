import { Injectable } from '@angular/core';

/* se almacenaran en session storage */
const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  constructor() { }

  public setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public setUsername(userName: string): void {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, userName);
  }

  public getUsername(): string {
    return sessionStorage.getItem(USERNAME_KEY);
  }

  public setAuthorites(authorities: string[]): void {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities)); // se pasa como json al ser un array
  }

  public getAuthorities(): string[] {
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
  }

  public logOut(): void {
    window.sessionStorage.clear();
  }
}
