import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  baseUrl: string = "http://localhost:8080";
  constructor(private http: HttpClient) { }

  getUsuarioByNombreUsuario(nombreUsuario: string): Observable<any> {
    return this.http.get<Usuario>(this.baseUrl + "/usuarios/find/" + nombreUsuario);
  }

  editarUsuario(usuario: Usuario): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json'); //Para indicar que enviamos un JSON
    return this.http.post(this.baseUrl + "/usuarios/editar", JSON.stringify(usuario), { headers: headers });
  }

}
