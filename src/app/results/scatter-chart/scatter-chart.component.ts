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
  selector: 'app-scatter-chart',
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.scss']
})
export class ScatterChartComponent implements AfterViewInit {
  @Input() data: Friend[] = [];
  @ViewChild('scatterChart') private chartContainer!: ElementRef;

  constructor() {}

  ngAfterViewInit() {
    if (this.data.length === 0) {
      return;
    }

    this.createChart();
  }

  private createChart() {
    const element = this.chartContainer.nativeElement;
    const data = this.data;
    const margin = { top: 20, right: 50, bottom: 50, left: 40 };

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - margin.left - margin.right;
    const contentHeight = element.offsetHeight - margin.top - margin.bottom;
    const maxWeight = d3.max(data, (d) => parseInt(d.weight)) as number;
    const x = d3
      .scaleLinear()
      .rangeRound([0, contentWidth])
      .domain([0, (d3.max(data, (d) => parseInt(d.age)) as number) + 5]);

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, maxWeight + 15]);

    const g = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

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
      .text('Age');
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    g.append('g').attr('class', 'axis axis--y').call(d3.axisLeft(y));

    g.selectAll('.scatter')
      .data(data)
      .enter()
      .append('circle')
      .attr('fill', (d) => {
        if (parseInt(d['weight']) > maxWeight * 0.6) {
          return 'red';
        } else if (parseInt(d['weight']) > maxWeight * 0.3) {
          return 'yellow';
        }
        return 'green';
      })
      .attr('cx', (d) => x(parseInt(d.age)))
      .attr('cy', (d) => y(parseInt(d.weight)))
      .attr('r', 7);
  }
}
