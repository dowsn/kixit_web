import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Image = (props) => {
  const saveImage = () => {
    fetch('http://localhost:4000/downloadImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: props.src,
        filename: 'image.png',
      }),
    });
  };

  const src = `data:image/jpeg;base64,${props.src}`;

  return (
    <div>
      <img src={src} alt={props.alt} />
      <button onClick={saveImage}>Save</button>
    </div>
  );
};


export default function ImageGenerator() {

  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  async function getImages() {

await fetch('http://localhost:4000/getImages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ prompt }),
})
.then((response) => response.json())
.then((data) => {
  const images = data.images;
  var tempImages = [];

  // Now you can use the images array to set images on your page
  images.forEach((image, index) => {
    var tempImage = {
      // If the image is base64 encoded, prepend with data:image/jpeg;base64,
      src: `data:image/jpeg;base64,${image.b64_json}`,
      alt: prompt,
    };
    tempImages.push(tempImage);
  });
  setImages(tempImages);
})
.catch((error) => console.error('Error:', error));
  }


  function handlePromptSubmit(e) {
    e.preventDefault();
    if (!prompt.includes('love')) {
      setError("The prompt must contain 'love'");
      return;
    }
    // If the prompt does contain "ahoj", continue with your logic here
    getImages();
  }


  // This method will delete a record

  // This method will map out the records on the table
  function imageList() {
    return images.map((image) => {
      return <Image key={image.src} src={image.src} alt={image.alt} />;
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <div>
      <h3>Images</h3>
      <form onSubmit={handlePromptSubmit}>
        <input
          type="text"
          placeholder="Please use prompt to generate image"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Generate</button>
      </form>
      <p>{error}</p>
      <div>{imageList()}</div>
    </div>
  );
}
