import React from 'react';

const PlayerInfo = ({ exhibitionTitle, score, username }) =>  (
  <div className="playerInfo">
    <div className="flex">
      <div className="score">{score}</div>
      <div className="username">{username}</div>
    </div>


    <div className="exhibitionTitle">{exhibitionTitle}</div>

    </div>
);

export default PlayerInfo;
