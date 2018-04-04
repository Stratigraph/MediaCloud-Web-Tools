import PropTypes from 'prop-types';
import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

const DEFAULT_WIDTH = 530;
const DEFAULT_MIN_BUBBLE_RADIUS = 5;
const DEFAULT_MAX_BUBBLE_RADIUS = 70;
const DEFAULT_HEIGHT = 200;


const localMessages = {
  noData: { id: 'chart.bubble.noData', defaultMessage: 'Sorry, but we don\'t have any data to draw this chart.' },
};

/**
 * Draw a bubble chart with labels.  Values are mapped to area, not radius.
 */
class BubbleRowChart extends React.Component {

  render() {
    const { data, width, height, maxBubbleRadius, asPercentage, minBubbleRadius, padding, domId, onBubbleClick } = this.props;

    // bail if no data
    if (data.length === 0) {
      return (
        <div>
          <p><FormattedMessage {...localMessages.noData} /></p>
        </div>
      );
    }

    // const { formatNumber } = this.props.intl;
    const options = {
      width,
      height,
      maxBubbleRadius,
      minBubbleRadius,
      padding,
    };
    if ((width === null) || (width === undefined)) {
      options.width = DEFAULT_WIDTH;
    }
    if ((height === null) || (height === undefined)) {
      options.height = DEFAULT_HEIGHT;
    }
    if ((minBubbleRadius === null) || (minBubbleRadius === undefined)) {
      options.minBubbleRadius = DEFAULT_MIN_BUBBLE_RADIUS;
    }
    if ((maxBubbleRadius === null) || (maxBubbleRadius === undefined)) {
      options.maxBubbleRadius = DEFAULT_MAX_BUBBLE_RADIUS;
    }
    if ((padding === null) || (padding === undefined)) {
      options.padding = 0;
    }

    let circles = null;

    // prep the data and some config (scale by sqrt of value so we map to area, not radius)
    const maxValue = d3.max(data.map(d => d.value));
    let radius;
    if (asPercentage) {
      radius = d3.scaleSqrt().domain([0, 1]).range([0, options.maxBubbleRadius]);
    } else {
      radius = d3.scaleSqrt().domain([0, maxValue]).range([0, options.maxBubbleRadius]);
    }
    let xOffset = 0;
    if (asPercentage) {
      circles = data.map((d, idx) => {
        xOffset = options.maxBubbleRadius + (((options.maxBubbleRadius * 2) + 10) * idx);
        return {
          ...d,
          r: radius(d.value),
          y: 0,
          x: xOffset,
        };
      });
    } else {
      circles = data.map((d, idx, list) => {
        if (idx > 0) {
          const preceeding = list.slice(0, idx);
          const diameters = preceeding.map(d2 => (radius(d2.value) * 2) + 10);
          xOffset = d3.sum(diameters);
        }
        xOffset += radius(d.value);
        return {
          ...d,
          r: radius(d.value),
          y: 0,
          x: xOffset,
        };
      });
    }


    let content = null;
    if (circles && circles.length > 0) {
      // render it all
      const node = ReactFauxDOM.createElement('div');
      const div = d3.select(node).append('div').attr('id', 'bubble-chart-wrapper');
      const svg = div.append('svg:svg');
      svg.attr('id', domId)
        .attr('width', options.width)
        .attr('height', options.height)
        .attr('class', 'bubble-chart');
      // rollover tooltip
      const rollover = d3.select('#bubble-chart-tooltip')
        .style('opacity', 0);

      const horizontalTranslaton = options.padding ? options.padding : xOffset;
      // draw background circles
      if (asPercentage) {
        const totalBubbles = svg.append('g')
          .attr('transform', `translate(${horizontalTranslaton},${options.height / 2})`)
          .selectAll('.total-bubble')
          .data(circles)
          .enter();
        totalBubbles.append('circle')
          .attr('class', 'total')
          .attr('r', options.maxBubbleRadius)
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
      }
      // now add the bubbles on top
      const bubbles = svg.append('g')
          .attr('transform', `translate(${horizontalTranslaton},${options.height / 2})`)
          .selectAll('.bubble')
          .data(circles)
          .enter();
      const cursor = onBubbleClick ? 'pointer' : '';
      bubbles.append('circle')
        .attr('class', 'pct')
        .attr('r', d => d.r)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .style('fill', d => d.fill || '')
        .style('cursor', () => cursor);

      // add tooltip to bubbles
      bubbles.selectAll('circle')
        .on('mouseover', (d) => {
          const pixel = 'px';
          rollover.html(d.rolloverText ? d.rolloverText : '')
          .style('left', d3.event.pageX + pixel)
          .style('top', d3.event.pageY + pixel);
          rollover.transition().duration(200).style('opacity', 0.9);
        })
        .on('mouseout', () => {
          rollover.transition().duration(500).style('opacity', 0);
        })
        .on('click', (d) => {
          if (onBubbleClick) {
            onBubbleClick(d);
          }
        });

      // add center labels
      bubbles.append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('text-anchor', 'middle')
        .attr('fill', d => `${d.centerTextColor} !important` || '')
        .attr('font-family', 'Lato, Helvetica, sans')
        .attr('font-size', '10px')
        .text(d => (d.centerText ? d.centerText : ''));
      // add top labels
      bubbles.append('text')
        .attr('x', d => d.x)
        .attr('y', d => (asPercentage ? d.y - options.maxBubbleRadius - 12 : d.y - d.r - 12))
        .attr('text-anchor', 'middle')
        .attr('fill', d => `${d.aboveTextColor} !important` || '')
        .attr('font-family', 'Lato, Helvetica, sans')
        .attr('font-size', '10px')
        .text(d => (d.aboveText ? d.aboveText : ''));
      // add bottom labels
      bubbles.append('text')
        .attr('x', d => d.x)
        .attr('y', d => (asPercentage ? d.y + options.maxBubbleRadius + 20 : d.y + d.r + 20))
        .attr('text-anchor', 'middle')
        .attr('fill', d => `${d.belowTextColor} !important` || '')
        .attr('font-family', 'Lato, Helvetica, sans')
        .attr('font-size', '10spx')
        .text(d => (d.belowText ? d.belowText : ''));

      content = node.toReact();
    }

    return content;
  }
}

BubbleRowChart.propTypes = {
  intl: PropTypes.object.isRequired,
  /*
  [{
    'value': number,
    'fill': string(optional),
    'centerText': string(optional),
    'centerTextColor': string(optional),
    'aboveText': string(optional),
    'aboveTextColor': string(optional),
    'belowText': string(optional),
    'belowTextColor': string(optional),
    'rolloverText': string(optional),
  }]
  */
  onBubbleClick: PropTypes.func,
  data: PropTypes.array.isRequired,
  domId: PropTypes.string.isRequired,  // to make download work
  width: PropTypes.number,
  height: PropTypes.number,
  placement: PropTypes.string,
  maxBubbleRadius: PropTypes.number,
  minBubbleRadius: PropTypes.number,
  asPercentage: PropTypes.bool, // draw each circle as a pct of a larger one
  padding: PropTypes.number,
};

export default injectIntl(BubbleRowChart);
