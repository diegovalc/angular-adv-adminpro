import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';


@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styleUrls: ['./incrementador.component.css']
})
export class IncrementadorComponent implements OnInit {

  @Input('valor') progreso : number = 80;
  @Input() btnClass: string = 'btn-primary';

  @Output('valor') valorSalida: EventEmitter<number> = new EventEmitter() ;
  
  constructor() { }

  ngOnInit(){
    this.btnClass = `btn ${ this.btnClass }`;
  }

  cambiarValor(valor: number){

    if (this.progreso >= 100 && valor >=0) {
      
      this.valorSalida.emit(100);
      this.progreso =100;
      return; // se sale del if
    }

    if (this.progreso <= 0 && valor <=0) {
      this.valorSalida.emit(0);
      this.progreso =0;
      return;
    }
    this.progreso = this.progreso + valor;
    this.valorSalida.emit(this.progreso);
    
  }

  onChange(nuevoValor: number){
    
    if (nuevoValor>=100) {
      this.progreso = 100;
    }else if(nuevoValor <=0){
      this.progreso = 0;
    }else{
      this.progreso = nuevoValor;
    }
    this.valorSalida.emit(this.progreso);
    
  }
}
