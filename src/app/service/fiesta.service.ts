import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Fiesta } from "src/models/fiesta";

@Injectable({
  providedIn: 'root'
})
export class FiestaService {

  baseUrl: string = "http://localhost:8080";
  constructor(private http: HttpClient) { }

  getAll(nombreUsuario: string): Observable<any> {
    return this.http.get(this.baseUrl + "/fiestas/" + nombreUsuario);
  }

  addFiesta(fiesta: Fiesta): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json'); //Para indicar que enviamos un JSON
    return this.http.post(this.baseUrl + "/fiestas/add", JSON.stringify(fiesta), { headers: headers });
  }

  encontrarFiesta(fiestaId: number): Observable<any> {
    return this.http.get(this.baseUrl + "/fiesta/" + fiestaId);
  }

  eliminarFiesta(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + "/fiestas/eliminar/" + id);
  }

}
