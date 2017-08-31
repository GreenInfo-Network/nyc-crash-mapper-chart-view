import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { width, height, xScale, yScale, area, line } from '../common/d3Utils';

/** Class that renders a list of SVG sparkLines
*/
class SparkLineList extends Component {
  static propTypes = {
    // eslint-disable-next-line
    entities: PropTypes.arrayOf(PropTypes.object),
    filterTerm: PropTypes.string,
  };

  static defaultProps = {
    filterTerm: '',
  };

  constructor() {
    super();
    this.renderSparkLines = this.renderSparkLines.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entities.length !== this.props.entities.length) {
      // if the entities array updated, compute max & sum, reset the scales
      this.setScales(nextProps.entities);
    }
  }

  // eslint-disable-next-line
  setScales(entities) {
    // compute max number of ped injuries, necessary for yScale.domain()
    // compute sum of ped injuries, so that councils may be sorted from max to min
    entities = entities.map(c => {
      const x = { ...c };
      x.maxPedInj = d3.max(c.values, d => d.pedestrian_injured);
      x.totalPedInj = d3.sum(c.values, d => d.pedestrian_injured);
      return x;
    });

    // sort councils by total ped injuries
    entities.sort((a, b) => {
      if (a.totalPedInj > b.totalPedInj) {
        return -1;
      }

      if (a.totalPedInj < b.totalPedInj) {
        return 1;
      }

      return 0;
    });

    // compute min and max date across councils, assumes data is sorted by date
    xScale.domain([
      d3.min(entities, c => c.values[0].year_month),
      d3.max(entities, c => c.values[c.values.length - 1].year_month),
    ]);

    // use same yScale domain
    yScale.domain([0, d3.max(entities, d => d.maxPedInj)]);
  }

  renderSparkLines() {
    const { entities } = this.props;
    if (!entities.length) return null;

    return entities.map(entity => {
      const { key, values } = entity;

      return (
        <li
          key={key}
          className={`city council ${key}`}
          style={{
            display: 'inline-block',
            margin: '5px',
          }}
        >
          <h6 style={{ padding: 0 }}>{`${key < 10 ? `0${key}` : key}`}</h6>
          <svg
            width={width}
            height={height}
            style={{ border: '1px solid #999' }}
          >
            <path fill="#e7e7e7" className="area spark" d={area(values)} />
            <path
              fill="none"
              strokeWidth="1.5px"
              stroke="#666"
              className="line spark"
              d={line(values)}
            />
          </svg>
        </li>
      );
    });
  }

  render() {
    const { filterTerm } = this.props;
    let listItems = this.renderSparkLines();

    if (listItems && filterTerm !== '') {
      listItems = listItems.filter(li => {
        const { props } = li;
        return (
          props.className.toLowerCase().indexOf(filterTerm.toLowerCase()) !== -1
        );
      });
    }

    return (
      <ul
        style={{
          width: width + 30,
          height: '100%',
          maxHeight: '600px',
        }}
        className="SparkLineList scroll"
      >
        {listItems}
      </ul>
    );
  }
}

export default SparkLineList;