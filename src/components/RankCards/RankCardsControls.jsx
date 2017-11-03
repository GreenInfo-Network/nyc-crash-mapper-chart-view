import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../common/d3Utils';

const RankCardsControls = ({ handleRankClick, handleNameClick, dateRanges }) => (
  <div className="RankCardsControls">
    <div className="rank-controls-copy">
      <p>
        We calculate rank by sorting on the number of injuries, then the number of fatalities, for
        each geographic area over the past 36 months, ending with the most recently completed month.
      </p>
    </div>
    <div className="rank-controls-dates-sort">
      <div className="rank-controls-date-range">
        {dateRanges && (
          <h6>{`${formatDate(dateRanges.startDate)} — ${formatDate(dateRanges.endDate)}`}</h6>
        )}
      </div>
      <div className="rank-controls-btns">
        <h6>SORT</h6>
        <button onClick={() => handleNameClick()}>Name</button>
        <button onClick={() => handleRankClick()}>Rank</button>
      </div>
    </div>
  </div>
);

RankCardsControls.propTypes = {
  handleRankClick: PropTypes.func.isRequired,
  handleNameClick: PropTypes.func.isRequired,
  dateRanges: PropTypes.shape({}),
};

RankCardsControls.defaultProps = {
  dateRanges: null,
};

export default RankCardsControls;
