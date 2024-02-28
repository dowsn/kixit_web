import React from 'react';

const handleChange = (event) => {
    onMessageChange(event.target.value);
  };


<input type="text" value={mes
          sage} onChange={handleChange} />

const WaitingRoom = ({ message }) => (
 <div>
          <ul>
            <li></li>
          </ul>
  </div>
);

export default WaitingRoom;