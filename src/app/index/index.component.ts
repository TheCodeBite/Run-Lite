import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  elements: Elements;
  card: StripeElement;

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

  constructor(private api:ApiService,private fb: FormBuilder, private stripeService: StripeService, private route: Router) { }
  buscar = false;

  ngOnInit() {
    this.verDestinos()
  }

  elementsOptions: ElementsOptions = {
    locale: 'es'
  };

  stripeTest: FormGroup;

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

    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          console.log(result.token);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });

  }
}
