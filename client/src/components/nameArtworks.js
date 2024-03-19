import axios from 'axios';
import { set } from 'mongoose';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getGameAndUser } from '../client_utils/safety_utils';
import { checkThreeWords, useTimeoutOverlay } from '../client_utils/text_utils';

export default function NameArtworks() {


  const { showOverlay, text } = useTimeoutOverlay(true, 'Welcome galerist');

  const [exhibitionTitle, setExhibitionTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [game, setGame] = useState({});
  const [player, setPlayer] = useState({});
  const [names, setNames] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {

    getGameAndUser(navigate).then((data) => {
      if (data) {

        console.log(data.gameData, data.playerData);

        const { gameData, playerData } = data;

          setGame(gameData);
          setPlayer(playerData);

          for (let i = 0; i < gameData.numberOfImages; i++) {
          setNames((prevNames) => [...prevNames, '']);
        }

          setExhibitionTitle(playerData.exhibitionTitle);

      }
    });






    // async function getExhibitionTitle() {
    //   try {

    //     const response = await axios.get(
    //       'http://localhost:4000/play_game/exhibition_title',
    //       {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'gameId': game._id,
    //           'playerId': player._id,
    //         },
    //       },
    //     );

    //     const data = response.data;
    //     if (data.success == true) {
    //       setExhibitionTitle(data.exhibitionTitle);
    //     } else {
    //        setExhibitionTitle("Your exhibition is missing. Please contact the game host.");
    //     }
    //     // Assuming the API returns a list of players and their readiness status
    //   } catch (error) {
    //     console.error(`Error: ${error}`);
    //     return false;
    //   }
    // }

    // getExhibitionTitle(gameId, playerId);

  }, []);


  async function handleSubmit(e) {
    e.preventDefault();
    // check if id ok

    let errors = [];

    names.forEach((name, i) => {

  if (checkThreeWords(name) !== null) {

    errors.push(
      'Name' + i + 'has this error: ' + checkThreeWords(name),
    );
    }

  }
  );



    if (errors.length > 0) {
      setErrorMessage(`${errors.join(' and ')}`);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }


const response = await fetch(
  `http://localhost:4000/play_game/name_artworks`,
  {
    headers: {
      'Content-Type': 'application/json',
      'gameId': game._id,
      'playerId': player._id,
    },
    method: 'POST',
    body: JSON.stringify({ names }),
  },
);

    const data = await response.json();

    if (response.ok) {
      setMessage('Success!');

    } else {
      setErrorMessage('Something went wrong. Please try again.');

      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }

    // waiting room for the game
    // navigate('/' + gameId);
  }

  // This following section will display the table with the records of individuals.
  return (
    <div>
      {exhibitionTitle === '' && (
            <h1>Loading...</h1>
      )}
      {message === '' && (

        <div>
          <h1>{exhibitionTitle}</h1>
          <form onSubmit={handleSubmit}>

            {names.map((name, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder={`Enter the name of the artwork ${index + 1}`}
                  value={name}
                  onChange={(event) => {
                    const newName = event.target.value;
                    setNames((prevNames) => {
                      const newNames = [...prevNames];
                      newNames[index] = newName;
                      return newNames;
                    });
                  }}
                />
              </div>
            ))}

            <br />
            <br />

            <button type="submit">Submit</button>
          </form>
          <div className="error">{errorMessage}</div>
        </div>)}



      {message !== '' && (
        <div>
          <p></p>
          <div className="message">{message}</div>
          <Link to="/play">
            <button>Play</button>
          </Link>
        </div>
      )}
    </div>
  );
}
