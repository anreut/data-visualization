import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ReactDOMServer from 'react-dom/server';
import Tooltip from './Tooltip';
import './MultiLineChart.scss';

const data = {
  series: [
    {
      name: 'JavaScript',
      values: [0, 1, 1, 3, 4, 4, 4, 6, 9, 3, 2, 4, 4, 8],
    },
    {
      name: 'Python',
      values: [3, 4, 5, 6, 6, 6, 9, 11, 8, 7, 3, 6, 2, 3],
    },
    {
      name: 'Java',
      values: [0, 0, 0, 0, 2, 2, 1, 3, 3, 2, 2, 5, 5, 1],
    },
    {
      name: 'C++',
      values: [1, 1, 1, 2, 2, 5, 4, 3, 2, 5, 5, 5, 2, 2],
    },
    {
      name: 'Golang',
      values: [0, 1, 3, 5, 3, 2, 1, 0, 2, 3, 8, 5, 3, 6],
    },
  ],
  dates: [
    new Date('2020-06-01'),
    new Date('2020-06-08'),
    new Date('2020-06-15'),
    new Date('2020-06-22'),
    new Date('2020-06-29'),
    new Date('2020-07-06'),
    new Date('2020-07-13'),
    new Date('2020-07-20'),
    new Date('2020-07-27'),
    new Date('2020-08-03'),
    new Date('2020-08-10'),
    new Date('2020-08-17'),
    new Date('2020-08-24'),
    new Date('2020-08-31'),
  ],
};

const MultiLineChart = () => {
  const svgWidth = 900;
  const svgHeight = svgWidth / 2; // 450
  const margin = { top: 30, right: 200, bottom: 30, left: 30 };
  const innerWidth = svgWidth - margin.left - margin.right; // 670
  const innerHeight = svgHeight - margin.top - margin.bottom; // 390

  const canvas = useRef(null);

  useEffect(() => {
    // Create svg
    const svg = d3
      .select(canvas.current)
      .append('svg')
      .attr('viewBox', [0, 0, svgWidth, svgHeight])
      .attr('height', svgHeight)
      .attr('width', svgWidth)
      .style('overflow', 'visible');

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.series, (d) => d3.max(d.values))])
      .nice()
      .range([svgHeight - margin.bottom, margin.top]);

    const x = d3
      .scaleUtc()
      .domain(d3.extent(data.dates))
      .range([margin.left, innerWidth + margin.left]);

    const myColor = d3
      .scaleOrdinal()
      .domain(
        data.series.map((val) => {
          return val.name; // ['Product Management', 'Human Resources', 'Marketing', 'Data', 'Development']
        }),
      )
      .range(['green', 'red', 'blue', 'yellow', 'cyan']);

    const line = d3
      .line()
      .defined((d) => !isNaN(d))
      .x((d, i) => x(data.dates[i]))
      .y((d) => y(d));

    // Create Axis
    const yAxis = (group) =>
      group
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(`-${innerWidth}`))
        .call((group) => group.select('.domain').remove());

    const xAxis = (group) => {
      group
        .attr(
          'transform',
          `translate(0,${svgHeight - margin.bottom})`,
        )
        .call(
          d3
            .axisBottom(x)
            .ticks(svgWidth / 80)
            .tickSizeOuter(0),
        )
        .call((group) => group.select('.domain').remove())
        .call((group) => group.selectAll('line').remove());
    };

    svg.append('g').attr('id', 'xAxis').call(xAxis);
    svg.append('g').attr('id', 'yAxis').call(yAxis);

    // Create tooltip wrapper
    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('z-index', '99')
      .style('visibility', 'hidden')
      .style('padding', '10px')
      .style('background', 'rgba(0,0,0,0.6)')
      .style('border-radius', '4px')
      .style('color', '#fff');

    const createPaths = (group) => {
      group
        .selectAll('g')
        .data(data.series)
        .join('g')
        .attr('fill', 'none')
        .attr('class', 'path')
        .attr('id', (d) => `${myColor(d.name)}`);

      group
        .selectAll('.path')
        .append('path')
        .data(data.series)
        .style('mix-blend-mode', 'multiply')
        .attr('stroke-width', 2.5)
        .attr('d', (d) => line(d.values))
        .attr('stroke', (d) => myColor(d.name));
    };

    const createCircles = (group) => {
      // Append circles to each group
      group.selectAll('.path').each(function (d) {
        // Outer circle
        d3.select(this)
          .append('g')
          .selectAll('circle')
          .data(d.values) // [1, 2, 3, 4, 5, ...]
          .join('circle')
          .attr('class', 'outer-circle')
          // add `name` attr to use this data later
          .attr('name', this.__data__.name)
          .attr('fill', 'white')
          .attr('stroke', myColor(this.__data__.name))
          .attr('stroke-width', 1)
          .attr('r', '6')
          .attr('cy', (d) => y(d))
          .attr('cx', (d, i) => x(data.dates[i]));

        // Inner circle
        d3.select(this)
          .append('g')
          .selectAll('circle')
          .data(d.values) // [1, 2, 3, 4, 5, ...]
          .join('circle')
          .attr('class', 'inner-circle')
          // add `name` attr to use this data later
          .attr('name', this.__data__.name)
          .attr('fill', myColor(this.__data__.name))
          .attr('r', '3')
          .attr('cy', (d) => y(d))
          .attr('cx', (d, i) => x(data.dates[i]))
          .on('mouseover', function (event, d, i) {
            tooltip
              .html(
                ReactDOMServer.renderToString(<Tooltip text={d} />),
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
          });
      });
    };

    // Create wrapper for paths
    const pathGroup = svg
      .append('g')
      .attr('fill', 'none')
      .attr('id', 'path-group')
      .call(createPaths)
      .call(createCircles);

    const moved = (e, d) => {
      // bring selected pathGroup to the front by sorting groups
      pathGroup.select(`#${myColor(d.name)}`).raise();

      // selected item
      // return object {name: '', values: []}
      const s = data.series.find((it) => it.name === d.name);

      // highlight selected path and disable others
      pathGroup
        .selectAll('path')
        .attr('stroke', (d) =>
          s.name === d.name ? myColor(d.name) : '#ddd',
        )
        .attr('stroke-width', (d) => (s.name === d.name ? 4 : 2.5));

      // highlight selected outer-circles and disable others
      pathGroup
        .selectAll('.outer-circle')
        .attr('stroke', function () {
          // since we don't have `name` value in `data` - we use `name` attr
          return this.attributes.name.value === s.name
            ? myColor(s.name)
            : '#ddd';
        });

      // highlight selected inner-circles and disable others
      pathGroup.selectAll('.inner-circle').attr('fill', function () {
        // since we don't have `name` value in `data` - we use `name` attr
        return this.attributes.name.value === s.name
          ? myColor(s.name)
          : '#ddd';
      });
    };

    const left = () => {
      // return all paths to its original state
      pathGroup
        .selectAll('.path')
        .selectAll('path')
        .attr('stroke', (d) => myColor(d.name))
        .attr('stroke-width', 2.5);

      // return all circles to its original state
      pathGroup.selectAll('.path').each(function (d) {
        d3.select(this)
          .selectAll('.inner-circle')
          .attr('fill', myColor(d.name));

        d3.select(this)
          .selectAll('.outer-circle')
          .attr('stroke', myColor(d.name));
      });
    };

    const hover = (p) => {
      p.on('mousemove', moved).on('mouseleave', left);
    };

    // hover on paths
    const paths = pathGroup.selectAll('.path');
    paths.call(hover);
  });

  return (
    <div ref={canvas}>
      <h3>Multiline chart</h3>
    </div>
  );
};

export default MultiLineChart;
