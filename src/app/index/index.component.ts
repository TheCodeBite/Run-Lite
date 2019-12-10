import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  buscadorForm = this.fb.group({
    fecha_salida:[""],
    fecha_regreso:[""],
    lugar_origen:[""],
    lugar_destino:[1],
    clase:[""],
    hora:[""]
  })
  sinResultados=false
  listViajes:any
  listDestinos:any

  constructor(private api:ApiService,private fb: FormBuilder,private route: Router) { }
  buscar = false;

  ngOnInit() {
    this.verDestinos()
  }

  search(){
    this.buscar = true;     
    this.sinResultados=false
    this.api.buscadorViajes(this.buscadorForm.value).subscribe(response => {
      this.listViajes=response
      console.log(response)
      if(this.listViajes.lenth==0){
        this.sinResultados=true
      }
    });
  }
  verDestinos(){
    this.api.verLugares(1).subscribe(response => {
      this.listDestinos=response
    });
  }

  buy(id){
    this.route.navigate(['/ticket/'+id])
  }
}
