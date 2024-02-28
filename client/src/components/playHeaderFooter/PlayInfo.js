import React from 'react';

const PlayerInfo = ({ exhibitionTitle, score, username }) =>  (
  <div className ="playerInfo">
      <div className="exhibitionTitle">{exhibitionTitle}</div>
      <div className="score">{score}</div>
      <div className="username">{username}</div>
    </div>
);

export default PlayerInfo;

     <PlayerInfo exhibitionTitle={currentState} score={player.score} username={player.name} />
