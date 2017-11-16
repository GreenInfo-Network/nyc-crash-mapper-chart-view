import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../common/d3Utils';

const RankCardsControls = ({ handleRankClick, handleNameClick, dateRanges }) => (
  <div className="RankCardsControls">
    <div className="rank-controls-copy scroll">
      <p>
        We calculate rank by adding up the crashes based on the settings in the "Filter by Type"
        menu at right. Then we sort on the number of injuries, then the number of fatalities, for
        each geographic area over the past 36 months, ending with the most recently completed month.
        To see two areas on other chart views, select them and then click Trend or Compare.
      </p>
    </div>
    <div className="rank-controls-dates-sort">
      <div className="rank-controls-date-range">
        {dateRanges && (
          <h6>{`${formatDate(dateRanges.startDate)} — ${formatDate(dateRanges.endDate)}`}</h6>
        )}
      </div>
      <div className="rank-controls-btns">
        <h6>Sort by:</h6>
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
