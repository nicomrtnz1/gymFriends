import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { Friend } from 'src/app/shared/friend.interface';
import * as d3 from 'd3';

@Component({
  selector: 'app-weight-chart',
  templateUrl: './weight-chart.component.html',
  styleUrls: ['./weight-chart.component.scss']
})
export class WeightChartComponent implements AfterViewInit {
  @Input() data: Friend[] = [];
  @ViewChild('weightChart') private chartContainer!: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
    if (this.data.length === 0) {
      return;
    }
    this.createChart();
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    const data = this.data;
    const margin = { top: 20, right: 50, bottom: 50, left: 40 };
    const myColors = d3.scaleLinear<string>().domain([1,data.length]).range(['#22e987', '#7b1fa2']);

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - margin.left - margin.right;
    const contentHeight = element.offsetHeight - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .rangeRound([0, contentWidth])
      .padding(0.1);

    const max = d3.max(data, (d) => parseInt(d.weight)) as number;

    const y = d3.scaleLinear().rangeRound([contentHeight, 0]).domain([0, max]);

    const g = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    g.append('g').attr('class', 'axis axis--y').call(d3.axisLeft(y));

    g.append('text')
      .attr('y', -30)
      .attr('x', 0 - element.offsetHeight / 4)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .style('fill', 'white')
      .text('Weight');
    g.append('text')
      .attr('x', element.offsetWidth / 2 - margin.left)
      .attr('y', element.offsetHeight - 40)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .text('Friends');

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('fill', (d ,i) => myColors(i))
      .attr('class', 'bar')
      .attr('x', (d) => x(d.name) as number)
      .attr('y', (d) => y(parseInt(d['weight'])))
      .attr('width', x.bandwidth())
      .attr('height', (d) => contentHeight - y(parseInt(d.weight)));
  }
}
