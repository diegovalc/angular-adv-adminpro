import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styleUrls: ['./grafica1.component.css']
})
export class Grafica1Component implements OnInit {

  public labels1: string[] = ['Pan', 'Refresco', 'Tacos'];
  public data1 = [
    [10, 15, 40],
  ];
  public labels2: string[] = ['Laptop', 'Tv', 'Estufa'];
  public data2 = [
    [18, 74, 41],
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
