import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contacto } from 'src/models/contacto';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  //contactoURL = environment.contactoURL;
  baseUrl: string = "http://localhost:8080";
  constructor(private http: HttpClient) { }

  getAll(nombreUsuario: string): Observable<any> {
    return this.http.get(this.baseUrl + "/contactos/" + nombreUsuario);
  }

  getAllContactosNotif(nombreUsuario: string): Observable<any> {
    return this.http.get(this.baseUrl + "/contactos/hoy/" + nombreUsuario);
  }

  encontrarContacto(contactoId: number): Observable<any> {
    return this.http.get(this.baseUrl + "/contacto/" + contactoId);
  }

  addContacto(contacto: Contacto): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json'); //Para indicar que enviamos un JSON
    return this.http.post(this.baseUrl + "/contactos/add", JSON.stringify(contacto), { headers: headers });
  }

  eliminarContacto(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + "/contactos/eliminar/" + id);
  }

}
