import React, { Component } from 'react';

class SparkLineContainer extends Component {
  static propTypes = {
    // eslint-disable-next-line
    entities: PropTypes.arrayOf(PropTypes.object),
  };

  constructor() {
    super();
    this.renderSparkLines = this.renderSparkLines.bind(this);
  }

  renderSparkLines() {
    const { entities } = this.props;
    return entities.map(entity => {
      const { key, value } = entity;
      return <div key={key}>{value}</div>;
    });
  }

  render() {
    return (
      <div className="SparkLineContainer">
        <input type="search" />
        <div className="SparkLineList">{this.renderSparkLines()}</div>
      </div>
    );
  }
}

export default SparkLineContainer;
