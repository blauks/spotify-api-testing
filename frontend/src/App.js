import React, { useEffect, useState } from 'react';
import './App.css';
import links from './resources/staticData'
import CurrPlaying from './components/CurrPlaying'
import Me from './components/Me'

function App() {
  const [showGodkjenn, changeShowGodkjenn] = useState(true)

  useEffect(() => {
    let urlP = new URLSearchParams(window.location.search)
    if (urlP.get("code") !== null) {
      changeShowGodkjenn(false)
    }
  }, [showGodkjenn])

  const SpotifyInfo = props => {
    return (
      <div className={"spotifyThings"}>
        <CurrPlaying />
        <Me />
      </div>
    )
  }

  return (
    <div className="App">
      {showGodkjenn && <a href={links.SPOTIFY_AUTH_ENDPOINT} rel="noopener noreferrer">Godta bruken av Spotify-brukeren din på denne nettsiden</a>}
      {!showGodkjenn && <SpotifyInfo />}
    </div >
  );
}

export default App;
