import { Component, Input, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styleUrls: ['./dona.component.css']
})
export class DonaComponent implements OnInit {

  @Input()title: string ='Sin Titulo';
  @Input('labels') doughnutChartLabels: Label[] = ['Label1', 'label2', 'label3'];
  @Input('data') doughnutChartData: MultiDataSet = [
    [350, 450, 100],
   
  ];
 
  public colors: Color [] =[
    {backgroundColor:['#6857E6','#009FEE','#F02059']}
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
