import React from 'react';

const StateInfo = ({ gameState, instructions }) => (
  <div className ="stateInfo">
    <div className="gameState">{gameState}</div>
    <div className="instructions">{instructions}</div>
  </div>
);

export default StateInfo;