import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Sugerencia } from "src/models/sugerencia";

@Injectable({
  providedIn: 'root'
})
export class SugerenciaService {

  baseUrl: string = "http://localhost:8080";
  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(this.baseUrl + "/sugerencias/");
  }

  getAllNombreUsuario(nombreUsuario: string): Observable<any> {
    return this.http.get(this.baseUrl + "/sugerencias/" + nombreUsuario);
  }

  addSugerencia(sugerencia: Sugerencia): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json'); //Para indicar que enviamos un JSON
    return this.http.post(this.baseUrl + "/sugerencias/add", JSON.stringify(sugerencia), { headers: headers });
  }

}
