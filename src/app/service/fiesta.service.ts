import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Fiesta } from "src/models/fiesta";

@Injectable({
  providedIn: 'root'
})
export class FiestaService {

  baseUrl:string = "http://localhost:8080";
  constructor(private http:HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(this.baseUrl + "/fiestas/1");
  }

  addFiesta(fiesta: Fiesta): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json'); //Para indicar que enviamos un JSON
    return this.http.post(this.baseUrl + "/fiestas/add", JSON.stringify(fiesta), {headers:headers});
  }
/*
  eliminarContacto(id: number) : Observable<any>{
    return this.http.get(this.baseUrl + "/contactos/eliminar/" + id);
  }
*/

  encontrarFiesta(fiestaId: number): Observable<any> {
    return this.http.get(this.baseUrl + "/fiesta/" + fiestaId);
  }

}
