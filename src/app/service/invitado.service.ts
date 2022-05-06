import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Invitado } from 'src/models/invitado';

@Injectable({
  providedIn: 'root'
})
export class InvitadoService {

  baseUrl: string = "http://localhost:8080";
  constructor(private http: HttpClient) { }

  getAll(fiestaId: number): Observable<any> {
    return this.http.get(this.baseUrl + "/invitados/" + fiestaId);
  }

  addInvitado(invitado: Invitado): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json'); //Para indicar que enviamos un JSON
    return this.http.post(this.baseUrl + "/invitados/add", JSON.stringify(invitado), { headers: headers });
  }

  eliminarInvitado(invitadoId: number): Observable<any> {
    return this.http.delete(this.baseUrl + "/invitados/eliminar/" +invitadoId);
  }

}
