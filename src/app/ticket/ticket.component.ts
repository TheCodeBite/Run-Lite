import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  comprarBoletoForm = this.fb.group({})
  datosViaje:any
  id:any
  costo=0
  asiento=""
  asientoAnt=""
  asientoOcupado=[]
  listAsientosOcupados:any
  listAsientos=[
    ["A1","disponible"],["A2","disponible"],["A3","disponible"],["A4","disponible"],["A5","disponible"],
    ["A6","disponible"],["A7","disponible"],["A8","disponible"],["A9","disponible"],["A10","disponible"],
    ["A11","disponible"],["A12","disponible"],["A13","disponible"],["A14","disponible"],["A15","disponible"],
    ["A16","disponible"],["A17","disponible"],["A18","disponible"],["A19","disponible"],["A20","disponible"],
    ["A21","disponible"],["A22","disponible"],["A23","disponible"],["A24","disponible"],["A25","disponible"],
    ["A26","disponible"],["A27","disponible"],["A28","disponible"],["A29","disponible"],["A30","disponible"],
    ["A31","disponible"],["A32","disponible"],["A33","disponible"],["A34","disponible"],["A35","disponible"],
    ["A36","disponible"],["A37","disponible"],["A38","disponible"],["A39","disponible"],["A40","disponible"]
  ]
  constructor(private rutaActiva: ActivatedRoute,private api:ApiService,private fb: FormBuilder,private route: Router) { }

  ngOnInit() {
    this.id=this.rutaActiva.snapshot.params.id
    this.verViaje(this.id)
    this.verAsientosOcupados(this.id)
  }

  verViaje(id){
    this.api.verViaje(id).subscribe(response => {
      this.datosViaje=response
      this.costo=(this.datosViaje.km + this.datosViaje.costo) + ((this.datosViaje.km + this.datosViaje.costo)*0.16)
      this.costo=this.costo- (this.costo*0.09)
      this.costo=Math.ceil(this.costo)
      this.inicializarFormulario()
    });
  }
  
  inicializarFormulario(){
    this.comprarBoletoForm = this.fb.group({
      fecha_salida:[this.datosViaje.fecha_salida],
      fecha_regreso:[this.datosViaje.fecha_regreso],
      lugar_origen:[this.datosViaje.origen],
      lugar_destino:[this.datosViaje.destino],
      clase:[this.datosViaje.clase],
      hora:[this.datosViaje.hora_nombre],
      tipo_boleto:[0],
      nombre:[""],
      correo:[""],
      tipo_pago:[""],
      costo:[this.costo],
      asiento:[""]
    })
  }

  calcularCosto(tipoBoleto){
    if(tipoBoleto==0){
      this.costo=(this.datosViaje.km + this.datosViaje.costo) + ((this.datosViaje.km + this.datosViaje.costo)*0.16)
      this.costo=this.costo- (this.costo*0.09)
    }else{
      this.costo=(this.datosViaje.km + this.datosViaje.costo) + ((this.datosViaje.km + this.datosViaje.costo)*0.16)
    }
    this.costo=Math.ceil(this.costo)
    this.comprarBoletoForm.get('costo').setValue(this.costo)
    this.comprarBoletoForm.get('tipo_boleto').setValue(tipoBoleto)
  }

  verAsientosOcupados(id){
    this.api.verAsientosOcupados(id).subscribe(response => {
      this.listAsientosOcupados=response
      this.asientosOcupados()
    });
  }
  asientoElegido(asiento){
    if(this.asiento!=""){
      this.listAsientos[this.asientoAnt][1]="disponible"
    }
    this.asiento=this.listAsientos[asiento][0]
    this.asientoAnt=asiento
    this.listAsientos[asiento][1]="seleccionado"
    this.comprarBoletoForm.get('asiento').setValue(this.asiento)
  }

  asientosOcupados(){
    for(let lugar of this.listAsientosOcupados){
      this.asientoOcupado.push(lugar.asiento)//lugares ocupados
    }
    for(let asiento of this.listAsientos){
      if(this.asientoOcupado.includes(asiento[0])){
        asiento[1]="ocupado"
      }
    }
  }

  comprarBoleto(){
    console.log(this.comprarBoletoForm.value)
  }
}
