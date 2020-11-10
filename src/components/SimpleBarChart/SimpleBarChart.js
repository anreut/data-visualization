import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ReactDOMServer from 'react-dom/server';
import Tooltip from './Tooltip';

const data = [
  { name: 'apple', price: 100 },
  { name: 'limon', price: 300 },
  { name: 'strawberry', price: 150 },
  { name: 'blueberry', price: 250 },
];

const SimpleBarChart = () => {
  const svgHeight = 600;
  const svgWidth = 600;
  const graphHeight = 500;
  const graphWidth = 500;
  const graphMarginLeft = (svgHeight - graphHeight) / 2;
  const graphMarginTop = (svgWidth - graphWidth) / 2;

  const canvas = useRef(null);

  useEffect(() => {
    // Create svg
    const svg = d3
      .select(canvas.current)
      .append('svg')
      .attr('viewBox', [0, 0, svgWidth, svgHeight])
      .attr('height', svgHeight)
      .attr('width', svgWidth);

    // Create group
    const graph = svg
      .append('g')
      .attr('height', graphHeight)
      .attr('width', graphWidth)
      .attr(
        'transform',
        `translate(${(svgWidth - graphWidth) / 2}, ${
          (svgHeight - graphHeight) / 2
        })`,
      );

    // Get max value of price
    const max = d3.max(data, (d) => d.price);

    // Generate height of each bar by y coordinate
    // returns func
    const y = d3
      .scaleLinear()
      .domain([0, max])
      .range([graphHeight, 0]);

    // Generate flexible width and x position for each bar
    // returns func
    const x = d3
      .scaleBand()
      .domain(data.map((it) => it.name))
      .range([0, graphWidth])
      .paddingInner(0.2)
      .paddingOuter(0.2);

    // Create tooltip wrapper
    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('padding', '10px')
      .style('background', 'rgba(0,0,0,0.6)')
      .style('border-radius', '4px')
      .style('color', '#fff');

    // Create rects
    // if any rect exists - select it or create a new one
    graph
      .selectAll('rect')
      // pass data
      .data(data)
      // for each array element create rect
      .join('rect')
      // to get flexible width of each bar use `x.bandwidth`
      .attr('width', x.bandwidth)
      // to get height of each bar use func `y(name)`
      .attr('height', (d) => graphHeight - y(d.price))
      // to get x of each bar use func `x(name) -> it returns position`
      .attr('x', (d) => x(d.name))
      .attr('y', (d) => y(d.price))
      .attr('fill', 'green')
      .on('mouseover', function (event, d, i) {
        tooltip
          .html(
            ReactDOMServer.renderToString(<Tooltip text={d.name} />),
          )
          .style('visibility', 'visible');

        d3.select(this).attr('fill', 'blue');
      })
      .on('mousemove', function (event) {
        tooltip
          .style('top', event.pageY + 10 + 'px')
          .style('left', event.pageX + 10 + 'px');
      })
      .on('mouseout', function () {
        tooltip.html(``).style('visibility', 'hidden');
        d3.select(this).transition().attr('fill', 'green');
      });

    // Create axis
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Show axis
    svg
      .append('g')
      .attr(
        'transform',
        `translate(${graphMarginLeft}, ${graphMarginTop})`,
      )
      .call(yAxis);

    svg
      .append('g')
      .attr(
        'transform',
        `translate(${graphMarginLeft}, ${
          svgHeight - graphMarginTop
        })`,
      )
      .call(xAxis);
  });
  return (
    <div ref={canvas}>
      <h3>Simple bar chart with a tooltip</h3>
    </div>
  );
};

export default SimpleBarChart;
