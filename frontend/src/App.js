import React from 'react';
import './App.css';
import links from './resources/static'
import CurrPlaying from './compontens/CurrPlaying'

function App() {
  return (
    <div className="App">
      <a href={links.SPOTIFY_AUTH_ENDPOINT} rel="noopener noreferrer">Godta bruken av Spotify-brukeren din på denne nettsiden</a>
      <CurrPlaying />
    </div >
  );
}

export default App;
