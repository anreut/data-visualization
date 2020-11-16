import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

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
      { name: 'b2', id: 'b2', children: ['c2', 'c3'] },
      { name: 'b3', id: 'b3', children: ['c4'] },
      { name: 'b4', id: 'b4', children: ['c5'] },
      { name: 'b5', id: 'b5', children: ['c6'] },
      { name: 'b6', id: 'b6', children: ['c7', 'c8'] },
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
      { name: 'c7', id: 'c7' },
      { name: 'c8', id: 'c8' },
    ],
  },
];

const nonHierarchicTree = () => {
  const svgWidth = 900;
  const svgHeight = 700;

  const canvas = useRef(null);

  useEffect(() => {
    // Create svg
    const svg = d3
      .select(canvas.current)
      .append('svg')
      .attr('viewBox', [0, 0, svgWidth, svgHeight])
      .attr('height', svgHeight)
      .attr('width', svgWidth)
      .style('overflow', 'visible')
      .style('border', '1px solid red');

    const generateNodes = (wrapper) => {
      data.forEach((node, nodeIndex) => {
        const nodeGroups = wrapper.append('g').attr('id', node.name);

        nodeGroups
          .selectAll('circle')
          .data(node.children)
          .join('circle')
          .attr('fill', 'red')
          .attr('id', (d) => d.id)
          .attr('r', 25)
          .attr('cx', (d) => {
            // Point scales allow to distribute an array of points equally into a given range interval. Example: https://observablehq.com/@d3/d3-scalepoint
            const x = d3
              .scalePoint()
              .domain(node.children.map((it) => it.name))
              .range([0, svgWidth])
              .padding(1)
              .round(true);
            return x(d.name);
          })
          .attr('cy', () => nodeIndex * 180)
          .on('mouseover', function (event, d, i) {
            // hightlight root
            d3.select('circle#root')
              .attr('stroke', 'black')
              .attr('stroke-width', 2);
            // hightlight other lines and circles
            highlight(d.id);
          })
          .on('mouseout', function (event, d, i) {
            d3.selectAll('path')
              .attr('stroke', 'red')
              .attr('stroke-width', 1);
            d3.selectAll('circle').attr('stroke', 'none');
          });

        return nodeGroups;
      });
    };

    const generateLines = (wrapper) => {
      const linesGroup = wrapper
        .append('g')
        // append element as first child of its parent
        .lower()
        .attr('id', 'lines');

      d3.selectAll('circle').each(function (d) {
        if (d.children) {
          d.children.forEach((child) => {
            const parentCircle = this;
            const childCircle = d3.select(`#${child}`);

            const parentX = parentCircle.attributes.cx.value;
            const parentY = parentCircle.attributes.cy.value;

            const childX = childCircle.attr('cx');
            const childY = childCircle.attr('cy');

            const curveX = childX;
            const curveY = parentY;

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
              .attr('id', `l-${childCircle.attr('id')}`)
              .attr('stroke', 'red')
              .attr('fill', 'none');
          });
        }
      });
    };

    const getSortedNodes = () => {
      const nodes = [];

      data.forEach((it) => {
        if (it.children) {
          nodes.push(...it.children);
        }
      });

      const root = nodes.find((it) => it.name === 'root');

      // move `root` to the end of the array
      // first remove it from the array
      _.pull(nodes, root);
      // then add a new one to the array
      const sorted = _.concat(nodes, root);
      return sorted;
    };

    // get all nodes and sort it so, that the root is at the end of the array
    const allNodes = getSortedNodes();

    const highlight = (nodeId) => {
      if (nodeId === 'root') return;

      const parentNodes = [];
      // hightlight selected circle
      d3.select(`#${nodeId}`)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
      // find and hightlight linked path
      d3.select(`#l-${nodeId}`)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

      // find parent circle
      const parent = allNodes.find((it) => {
        if (it.children) {
          return it.children.includes(nodeId);
        }
      });

      parentNodes.push(parent);

      const root = allNodes.find((it) => it.name === 'root');
      const isRoot = _.includes(parentNodes, root);

      // if it reaches the root node - stop function
      if (!isRoot) {
        highlight(parent.id);
      }
    };

    svg.append('g').call(generateNodes).call(generateLines);
  });

  return (
    <div ref={canvas}>
      <h3>Nonhierarchic Tree</h3>
    </div>
  );
};

export default nonHierarchicTree;
