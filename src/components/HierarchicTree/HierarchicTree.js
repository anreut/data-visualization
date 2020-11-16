import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './HierarchicTree.scss';

// const data = [
//   {
//     name: 'slice',
//     children: [
//       {
//         name: 'slice',
//         id: 'slice',
//         children: ['a1', 'a2', 'a3', 'a4'],
//       },
//     ],
//   },
//   {
//     name: 'subnets',
//     children: [
//       { name: 'a1', id: 'a1', children: ['b1', 'b3'] },
//       { name: 'a2', id: 'a2', children: ['b2', 'b3'] },
//       { name: 'a3', id: 'a3', children: ['b4', 'b5'] },
//       { name: 'a4', id: 'a4', children: ['b5', 'b6'] },
//     ],
//   },
//   {
//     name: 'mfs',
//     children: [
//       { name: 'b1', id: 'b1', children: ['c1'] },
//       { name: 'b2', id: 'b2', children: ['c2', 'c3'] },
//       { name: 'b3', id: 'b3', children: ['c4'] },
//       { name: 'b4', id: 'b4', children: ['c5'] },
//       { name: 'b5', id: 'b5', children: ['c6'] },
//       { name: 'b6', id: 'b6', children: ['c7', 'c8'] },
//     ],
//   },
//   {
//     name: 'nodes',
//     children: [
//       { name: 'c1', id: 'c1', children: ['d1'] },
//       { name: 'c2', id: 'c2', children: ['d1', 'd2'] },
//       { name: 'c3', id: 'c3', children: ['d2'] },
//       { name: 'c4', id: 'c4', children: ['d3'] },
//       { name: 'c5', id: 'c5', children: ['d3', 'd4'] },
//       { name: 'c6', id: 'c6', children: ['d4'] },
//     ],
//   },
//   {
//     name: 'dcs',
//     children: [
//       { name: 'd1', id: 'd1' },
//       { name: 'd2', id: 'd2' },
//       { name: 'd3', id: 'd3' },
//       { name: 'd4', id: 'd4' },
//     ],
//   },
// ];

const data = [
  {
    name: 'root',
    children: [
      {
        name: 'root',
        id: 'root',
        children: ['a1', 'a2', 'a3', 'a4'],
      },
    ],
  },
  {
    name: 'level_1',
    children: [
      { name: 'a1', id: 'a1', children: ['b1', 'b3'] },
      { name: 'a2', id: 'a2', children: ['b2', 'b3'] },
      { name: 'a3', id: 'a3', children: ['b4', 'b5'] },
      { name: 'a4', id: 'a4', children: ['b5', 'b6'] },
    ],
  },
  {
    name: 'level_2',
    children: [
      { name: 'b1', id: 'b1', children: ['c1'] },
      { name: 'b2', id: 'b2', children: ['c2'] },
      { name: 'b3', id: 'b3', children: ['c3'] },
      { name: 'b4', id: 'b4', children: ['c4'] },
      { name: 'b5', id: 'b5', children: ['c5'] },
      { name: 'b6', id: 'b6', children: ['c6'] },
    ],
  },
  {
    name: 'level_3',
    children: [
      { name: 'c1', id: 'c1' },
      { name: 'c2', id: 'c2' },
      { name: 'c3', id: 'c3' },
      { name: 'c4', id: 'c4' },
      { name: 'c5', id: 'c5' },
      { name: 'c6', id: 'c6' },
    ],
  },
];

const hierarchicTree = () => {
  const canvas = useRef(null);

  const config = {
    svgWidth: 900,
    svgHeight: 600,
    nodeRadius: 25,
    step: 40,
  };

  useEffect(() => {
    const svg = d3
      .select(canvas.current)
      .append('svg')
      .attr('viewBox', [0, 0, config.svgWidth, config.svgHeight])
      .attr('height', config.svgHeight)
      .attr('width', config.svgWidth)
      .attr('id', 'hierarchic-tree')
      .style('overflow', 'visible')
      .style('border', '1px solid red');

    const traslateNodes = (it) => {
      const groupWidth =
        (config.nodeRadius * 2 + config.step) * it.children.length -
        config.step;

      return config.svgWidth / 2 - groupWidth / 2 + config.nodeRadius;
    };

    const renderNodes = (wrapper) => {
      data.forEach((item, itemIndex) => {
        const itemGroup = wrapper
          .append('g')
          .attr('id', item.name)
          .attr('transform', `translate(${traslateNodes(item)}, 0)`);

        itemGroup
          .selectAll('circle')
          .data(item.children)
          .join('circle')
          .attr('fill', 'red')
          .attr('id', (d) => d.id)
          .attr('r', config.nodeRadius)
          .attr('cx', (d, i) => {
            return i * (config.nodeRadius * 2 + config.step);
          })
          .attr('cy', () => itemIndex * 180);

        return itemGroup;
      });
    };

    // const renderLines = (wrapper) => {
    //   const linesGroup = wrapper
    //     .append('g')
    //     .lower()
    //     .attr('id', 'lines');

    //   data.forEach((item) => {
    //     item.children.forEach((it) => {
    //       if (it.children) {
    //         it.children.forEach((child) => {
    //           const parentC = this;
    //           const childC = d3.select(`circle#${child}`).node();
    //           console.log(parentC);
    //         });
    //       }
    //     });
    //   });
    // };

    const renderLines = (wrapper) => {
      const linesGroup = wrapper
        .append('g')
        .lower()
        .attr('id', 'lines');

      d3.selectAll('circle').each(function (d) {
        if (d.children) {
          d.children.forEach((child) => {
            const parentC = this;
            const childC = d3.select(`circle#${child}`).node();

            const parentX = parentC.getBoundingClientRect().x + 15;
            const parentY = parentC.getBoundingClientRect().y - 30;

            const childX = childC.getBoundingClientRect().x + 15;
            const childY = childC.getBoundingClientRect().y - 80;

            const curveX = childX + 20;
            const curveY = parentY + 55;

            const points = [
              [parentX, parentY],
              [curveX, curveY],
              [childX, childY],
            ];

            const pathData = d3.line().curve(d3.curveCardinal)(
              points,
            );

            linesGroup
              .append('path')
              .attr('d', pathData)
              // .attr('id', `l-${childC.attr('id')}`)
              .attr('stroke', 'green')
              .attr('fill', 'none');
          });
        }
      });
    };

    svg.append('g').call(renderNodes).call(renderLines);

    // center line
    // svg
    //   .append('path')
    //   .attr('d', `M 450 0 L 450 500`)
    //   .attr('stroke', 'black');
  });

  return (
    <div ref={canvas}>
      <h3>Hierarchic Tree</h3>
    </div>
  );
};

export default hierarchicTree;
