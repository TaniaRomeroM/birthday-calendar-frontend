import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contacto } from 'src/models/contacto';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  baseUrl:string = "http://localhost:8080";
  constructor(private http:HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(this.baseUrl + "/contactos/1");
  }

  encontrarContacto(contactoId: number): Observable<any> {
    return this.http.get(this.baseUrl + "/contacto/" + contactoId);
  }

  addContacto(contacto: Contacto): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json'); //Para indicar que enviamos un JSON
    return this.http.post(this.baseUrl + "/contactos/add", JSON.stringify(contacto), {headers:headers});
  }

  eliminarContacto(id: number) : Observable<any>{
    return this.http.get(this.baseUrl + "/contactos/eliminar/" + id);
  }

}
