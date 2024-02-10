import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ExhibitionLabel = (props) => (
  <li>{props.name}</li>
);


export default function ExhibitionGenerator() {
  const [exhibitions, setExhibitions] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getExhibitions() {

      const response = await fetch(`http://localhost:4000/exhibitions`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const exhibitions = await response.json();
      setExhibitions(exhibitions);
    }

    getExhibitions();

    return;
  }, []);

  // This method will delete a record

  // This method will map out the records on the table
  function exhibitionList() {
    return exhibitions.map((exhibition) => {
      return <ExhibitionLabel key={exhibition.name} name={exhibition.name} />;
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <div>
      <h3>Exhibitions</h3>
      <ul>{exhibitionList()}</ul>
    </div>
  );
}
