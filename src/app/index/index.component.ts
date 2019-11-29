import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(private route: Router) { }
  buscar = false;

  ngOnInit() {
  }

  search(){
    this.buscar = true;
  }

  buy(){
    this.route.navigate(['/ticket'])
  }

}
