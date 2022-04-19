import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Compra } from 'src/models/compra';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  baseUrl: string = "http://localhost:8080";
  constructor(private http: HttpClient) { }

  getAll(fiestaId: number): Observable<any> {
    return this.http.get(this.baseUrl + "/compras/" + fiestaId);
  }

  addCompra(compra: Compra): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json'); //Para indicar que enviamos un JSON
    return this.http.post(this.baseUrl + "/compras/add", JSON.stringify(compra), { headers: headers });
  }

  eliminarCompra(compraId: number): Observable<any> {
    return this.http.delete(this.baseUrl + "/compras/eliminar/" + compraId);
  }

}
