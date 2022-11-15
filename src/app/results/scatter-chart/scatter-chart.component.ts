import { Component, ElementRef, Input, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Friend } from 'src/app/shared/friend.interface';
import * as d3 from 'd3';
@Component({
  selector: 'app-scatter-chart',
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.scss']
})
export class ScatterChartComponent implements AfterViewInit {
  @Input() data: Friend[] =[];
  @ViewChild('scatterChart') private chartContainer!: ElementRef;
  margin = { top: 20, right: 50, bottom: 30, left: 40 };

  constructor() { }

  ngAfterViewInit() {
    if (this.data.length === 0) { return; }

    this.createChart();
  }

  private createChart() {
    const element = this.chartContainer.nativeElement;
    const data = this.data;

    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleLinear()
      .rangeRound([0, contentWidth])
      .domain([0, d3.max(data, d => parseInt(d.age)) as number]);

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, d => parseInt(d.weight)) as number]);

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y));

    g.selectAll('.scatter')
      .data(data)
      .enter().append('circle')
       .attr('cx', d => x(parseInt(d.age)))
      .attr('cy', d => y(parseInt(d.weight)))
      .attr("r", 7)
  }

}
