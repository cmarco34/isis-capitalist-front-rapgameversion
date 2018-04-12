import { Component, Input } from '@angular/core';

import { RestserviceService } from './restservice.service';
import { World, Pallier, Product } from './world';
import { ProductComponent } from './product/product.component';
import { ToasterService, ToasterModule } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ToasterModule]
})

export class AppComponent {
  newUser(): any {
    throw new Error("Method not implemented.");
  }
  toasterService: ToasterService;
  title = 'ISIS RAP GAME';
  world: World = new World();
  server: string;
  qtmulti: string ="1";
  manager: Pallier;
  manDisp: boolean =false;
  username: string;

  constructor(private service: RestserviceService, toasterService: ToasterService) {
    this.server = service.getServer();
    this.toasterService = toasterService;
    this.username = localStorage.getItem("username");
    if (this.username == null) {
      this.username="player"+Math.floor(Math.random() * 10000)
    }

    service.getWorld().then(
      world => {
        this.world = world;
      });
  }

  @Input() productComponentInstance: ProductComponent;

  ngOnInit() {
    setInterval(() => { this.verifManager(); }, 100);
  }

  onProductionDone(p : Product) {
    this.world.money=this.world.money+p.revenu*p.quantite;
    this.world.score=this.world.score+p.revenu*p.quantite;
    console.log(this.world.score);
    console.log(this.world.money);
  }

  onBuyDone(c : number) {
    this.world.money=this.world.money-c;
  }

  changeMulti(qtmulti : string) {
    switch(this.qtmulti) { 
      case "1": {
        this.qtmulti="10";
        break;
      }
      case "10": { 
        this.qtmulti="100"; 
        break; 
      } 
      case "100": { 
        this.qtmulti="Max"; 
        break;
      }
      case "Max": { 
        this.qtmulti="1"; 
        break;
      }
    }
    return this.qtmulti;
  }

  hireManager(m:Pallier) {
    if (this.world.money>m.seuil && m.unlocked==false) {
      this.world.money=this.world.money-m.seuil;
      m.unlocked=true;
      this.world.products.product.forEach(p => {
        if(p.id == m.idcible) {
          p.managerUnlocked=true;
          this.toasterService.pop('succes', "Bien joué mamène", "Le manager "+m.name+" rejoint ton crew pour soutenir " +p.name);
          alert("Le manager "+m.name+" rejoint ton crew pour soutenir " +p.name);
        }
      })
    }
    else {
      if(m.unlocked==false) {
        this.toasterService.pop('error', "Tu l'as déjà mamène", m.name+" fait déjà partie de ton crew");
      }
      else {
        this.toasterService.pop('error', "Tu manques de thunes mamène", "Va falloir bibi plus que ça pour se payer ce genre de bails");
      }     
    }

  }

  verifManager() {
    this.world.managers.pallier.forEach(m => {
      if(m.seuil < this.world.money && m.unlocked == false) {
        this.manDisp=true;
      }
      else {
        this.manDisp=false;
      }
    })
  }
  
}