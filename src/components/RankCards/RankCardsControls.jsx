import React from 'react';

export default () => (
  <div className="RankCardsControls">
    <div className="rank-controls-copy">
      <p>
        We calculate rank by sorting on the number of injuries, then the number of fatalities, for
        each geographic area over the past 36 months, ending with the most recently completed month.
      </p>
    </div>
    <div className="rank-controls-dates-sort">
      <div className="rank-controls-date-range">
        <h6>MM/YY — MM/YY</h6>
      </div>
      <div className="rank-controls-btns">
        <h6>SORT</h6>
        <button onClick={() => {}}>Name</button>
        <button onClick={() => {}}>Rank</button>
      </div>
    </div>
  </div>
);
