import { Component, ElementRef, Input, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Friend } from 'src/app/shared/friend.interface';
import * as d3 from 'd3';

@Component({
  selector: 'app-weight-chart',
  templateUrl: './weight-chart.component.html',
  styleUrls: ['./weight-chart.component.scss']
})
export class WeightChartComponent implements AfterViewInit {
  @Input() data: Friend[] =[];
  @ViewChild('weightChart') private chartContainer!: ElementRef;
  margin = { top: 20, right: 20, bottom: 30, left: 40 };

  constructor() { }

  ngAfterViewInit(): void {
    if (this.data.length === 0) { return; }
    this.createChart();
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    const data = this.data;

    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.name))
      .rangeRound([0, contentWidth])
      .padding(0.1);

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

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
       .attr('x', d => x(d.name)as number)
      .attr('y', d => y(parseInt(d['weight'])))
      .attr('width', x.bandwidth())
      .attr('height', d => contentHeight - y(parseInt(d.weight)));
  }

}
