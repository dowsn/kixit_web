import { useEffect, useState } from 'react';

export function checkOneName(username) {
  console.log('username', username);
  if (!username || !/^[a-zA-Z0-9]+$/.test(username)) {
    return 'Invalid username';
  }
  return null;
}

export function checkThreeWords(input) {
  const words = input.split(' ');

  if (words.length < 3) {
    return 'Input must contain at least three words';
  }

  for (let word of words) {
    if (!/^[a-zA-Z0-9]+$/.test(word)) {
      return 'Invalid word: ' + word;
    }
  }

  return null;
}

export function checkPrompt(input, artworkName, exhibitionName) {

    const forbiddenWords = [
      ...artworkName.split(' '),
      ...exhibitionName.split(' '),
    ];

  const words = input.split(' ');

  for (let word of words) {
    if (forbiddenWords.includes(word)) {
      return 'Input cannot contain words from artwork or exhibition name';
    }

    if (!/^[a-zA-Z0-9]+$/.test(word)) {
      return 'Invalid word: ' + word;
    }
  }

  return null;
}


export function useTimeoutOverlay(initialState,  initialText) {
  const [showOverlay, setShowOverlay] = useState(initialState);
  const [text, setText] = useState(initialText);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return { showOverlay, text };
}

export function HandleError(errorData) {
  const [error, setError] = useState('');

  setError(errorData.message);

  setTimeout(() => {
    setError('');
  }, 2000);

  return { error };
}
