import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { RestserviceService } from '.././restservice.service';
import { World, Pallier, Product } from '.././world';

declare var require;
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})


export class ProductComponent implements OnInit {
  lastupdate: any;
  product: Product;
  world : World;
  server: string;
  progressbar: any;
  _qtmulti: string;
  _money: number;
  couttotal : number;
  total : number;
  intcout : number;
  multi : number;
  argent : number;
  revenutotal : number;

  @ViewChild('bar') progressBarItem;

  @Input() set prod(value: Product) {
    this.product = value;
  }
  
  @Input()
  set qtmulti(value: string) {
  this._qtmulti = value;
  if (this._qtmulti && this.product) this.calcMaxCanBuy();
  }

  @Input()
  set money(value: number) {
    this._money = value;
  }

  constructor(private service: RestserviceService) {
    this.server = service.getServer();
  }

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  @Output() notifyBuy: EventEmitter<Number> = new EventEmitter<Number>();
  
  ngOnInit() {
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, { strokeWidth: 50, color:'#00ff00' });
    setInterval(() => { this.calcScore(); }, 100);
  }

  calcScore() {
    if (this.product.timeleft>0) {
      this.product.timeleft=this.product.timeleft-(Date.now()-this.lastupdate);
      this.lastupdate=Date.now();
      if (this.product.timeleft<=0) {
        this.notifyProduction.emit(this.product);
        this.product.timeleft=0;
        this.progressbar.set(0)
      }
    }
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
    if (this.product.managerUnlocked==true && this.product.timeleft==0) {
      this.startFabrication();
    }
    this.revenutotal=this.product.quantite*this.product.revenu;
  }

  startFabrication() {
    if (this.product.quantite!=0 && this.product.timeleft==0) {
      this.product.timeleft=this.product.vitesse;
      this.lastupdate=Date.now();
      this.progressbar.animate(1, { duration: this.product.vitesse })
    }
  }

  calcMaxCanBuy() {
    this.total=1 ;
    this.couttotal=this.product.cout;
    switch(this._qtmulti) {
      case "10" : {
        this.total= 10;
        var a = 0;
        while(a<9) {
          a++;
          this.couttotal=this.couttotal+this.product.cout*Math.pow(this.product.croissance,a)
        }
        break;
      } 
      case "100": {
        this.total= 100;
        var a = 0;
        while(a<99) {
          a++;
          this.couttotal=this.couttotal+this.product.cout*Math.pow(this.product.croissance,a)
        }
        break;
      }
      case "Max": { 
        this.total=1;
        while( this._money > (this.couttotal+this.product.cout*Math.pow(this.product.croissance,this.total)) ) {
          this.couttotal=this.couttotal+this.product.cout*Math.pow(this.product.croissance,this.total);
          this.total= this.total + 1
        }
        break;
      }
    }
  }

  buy(){
    if(this._money < this.couttotal){
      alert("Va falloir bibi plus que ça pour se payer ce genre de bails");
    }else{
    this.product.quantite += this.total;
    this.product.cout = this.product.cout*Math.pow(this.product.croissance,this.total);
    this.notifyBuy.emit(this.couttotal);
    }
  }

}
