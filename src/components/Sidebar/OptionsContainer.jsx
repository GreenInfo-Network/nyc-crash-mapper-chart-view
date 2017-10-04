import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Collapse from 'react-collapse';
import cx from 'classnames';

class OptionsContainer extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
    className: PropTypes.string, // additional classname(s) to tack on to section el
    collapsable: PropTypes.bool, // should the content be collapsable?
    collapseHeight: PropTypes.number, // should the collapsable content have a fixed height?
    isOpened: PropTypes.bool,
    optionsContainerHeight: PropTypes.number, // height for the options container
    ruledLine: PropTypes.bool, // add a ruled line under the header?
    scroll: PropTypes.bool, // should the content in Collapse be scrollable?
    title: PropTypes.string.isRequired, // title in the header,
    onMeasure: PropTypes.func, // function to be invoked when Collapse changes size
  };

  static defaultProps = {
    className: '',
    collapsable: true,
    collapseHeight: 0,
    isOpened: true,
    optionsContainerHeight: null,
    ruledLine: false,
    scroll: false,
    onMeasure: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      opened: props.isOpened,
    };
    this.handleOpenClose = this.handleOpenClose.bind(this);
  }

  handleOpenClose() {
    if (this.props.collapsable) {
      this.setState(prevState => ({ opened: !prevState.opened }));
    }
  }

  render() {
    const {
      children,
      collapsable,
      collapseHeight,
      optionsContainerHeight,
      ruledLine,
      scroll,
      title,
      className,
      onMeasure,
    } = this.props;
    const { opened } = this.state;
    const fixedHeight = collapseHeight > 0 ? collapseHeight : undefined;
    const optionsContainerCX = cx(className, {
      'options-container': true,
      collapsable,
      opened,
    });
    const collapseCX = cx({
      'options-container-collapsable': true,
      scroll,
    });

    return (
      <section className={optionsContainerCX} style={{ height: optionsContainerHeight }}>
        <div className="options-container-header" onClick={() => this.handleOpenClose()}>
          <h6 className="options-container-title">{title}</h6>
          {collapsable && (
            <span className="options-container-collapse-icon">{opened ? '–' : '+'}</span>
          )}
          {ruledLine ? <hr /> : null}
        </div>
        <Collapse
          className={collapseCX}
          isOpened={opened}
          fixedHeight={fixedHeight}
          onMeasure={onMeasure}
        >
          {children}
        </Collapse>
      </section>
    );
  }
}

export default OptionsContainer;
