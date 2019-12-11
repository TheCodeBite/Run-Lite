import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  token_pago: any;

  elements: Elements;
  card: StripeElement;

  elementsOptions: ElementsOptions = {
    locale: 'es'
  };

  stripeTest: FormGroup;


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
  constructor(private rutaActiva: ActivatedRoute,private api:ApiService,private fb: FormBuilder,private route: Router,  private stripeService: StripeService) { }

  ngOnInit() {
    this.id=this.rutaActiva.snapshot.params.id
    
    this.verViaje(this.id)
    this.verAsientosOcupados(this.id)

    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });

    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.card) {
          this.card = this.elements.create('card', {
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                  color: '#CFD7E0'
                }
              }
            }
          });
          this.card.mount('#card-element');
        }
      });

      this.comprarBoletoForm = this.fb.group({
        itinerario:[this.id],
        nombre:[""],
        correo:[""],
        costo:[this.costo],
        asiento:[""]
      })
  }

  verViaje(id){
    this.api.verViaje(id).subscribe(response => {
      this.datosViaje=response
      this.costo=(this.datosViaje.km + this.datosViaje.costo) + ((this.datosViaje.km + this.datosViaje.costo)*0.16)
      this.costo=this.costo- (this.costo*0.09)
      this.costo=Math.ceil(this.costo)
    });
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


  temp: any;

  comprarBoleto(){
    this.comprarBoletoForm.value.costo = this.costo;
    console.log(this.comprarBoletoForm.value)
    console.log(this.stripeTest.value);

    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          console.log(result.token);
          var body = {
            amount: [this.comprarBoletoForm.value.costo],
            stripeToken: result.token
          }

          this.api.realizarPago(body).subscribe(response => {
            console.log(response);
            this.api.comprarBoleto(this.comprarBoletoForm.value).subscribe(response => {
              console.log(response);
              
            })
          })


        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }
}
