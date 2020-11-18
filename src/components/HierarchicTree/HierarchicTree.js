import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import './HierarchicTree.scss';

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
          .attr('cy', () => itemIndex * 180)
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
              .attr('stroke', 'green')
              .attr('stroke-width', 1);
            d3.selectAll('circle').attr('stroke', 'none');
          });

        return itemGroup;
      });
    };

    const renderLines = (wrapper) => {
      const linesGroup = wrapper
        .append('g')
        .lower()
        .attr('id', 'lines');

      d3.selectAll('circle').each(function (d) {
        if (d.children) {
          d.children.forEach((child) => {
            const parentCircle = this;
            const childCircle = d3.select(`circle#${child}`).node();

            const parentX =
              parentCircle.getBoundingClientRect().x + 15;
            const parentY =
              parentCircle.getBoundingClientRect().y - 30;

            const childX = childCircle.getBoundingClientRect().x + 15;
            const childY = childCircle.getBoundingClientRect().y - 80;

            const middlePoint = (parentX - childX) / 2;
            const curveX = childX + middlePoint;
            const curveY = parentY + 45;

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
              .attr('id', `l-${childCircle.attributes.id.value}`)
              .attr('stroke', 'green')
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

    svg.append('g').call(renderNodes).call(renderLines);
  });

  return (
    <div ref={canvas}>
      <h3>Custom Hierarchic Tree</h3>
    </div>
  );
};

export default hierarchicTree;
