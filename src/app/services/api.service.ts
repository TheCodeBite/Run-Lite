import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})  
export class ApiService {
  url="https://runliteapi.herokuapp.com/api/v1/";
  url_pay = "http://localhost:3000/";

  constructor(private http: HttpClient) { }
  
  buscadorViajes(params){
    return this.http.post(this.url + 'itinerario/buscador/',params);
  }
  verLugares(id){
    return this.http.get(this.url + 'lugares/'+id+"/");
  }
  verViaje(id){
    return this.http.get(this.url + 'itinerario/'+id+"/");
  }
  verAsientosOcupados(id){
    return this.http.get(this.url + 'boletos/'+id+"/");
  }

  //Pagos
  realizarPago(pago: any){
    return this.http.post(this.url_pay + 'pago_tarjeta', pago);
  }

  comprarBoleto(boleto: any){
    return this.http.post(this.url + 'boletos/', boleto)
  }
}

