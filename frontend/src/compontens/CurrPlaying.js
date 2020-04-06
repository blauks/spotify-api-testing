import React, { useState, useEffect } from 'react';
import secrets from '../resources/secrets';
import staticData from '../resources/static';

const CurrPlaying = props => {
    const [spotifyCode, changeCode] = useState("");
    const [accessCode, changeAccessCode] = useState(null)
    const [dataSpotify, changeDataSpotify] = useState()

    const urlParams = new URLSearchParams(window.location.search);

    const getAccess = async () => {

        let tokenData = new URLSearchParams()
        tokenData.append("grant_type", "authorization_code")
        tokenData.append("code", spotifyCode)
        tokenData.append("redirect_uri", "http://localhost:3000")
        tokenData.append("client_id", staticData.client_id)
        tokenData.append("client_secret", secrets.clientSecret)

        let respAccess = await fetch("https://accounts.spotify.com/api/token", {
            method: 'POST',
            body: tokenData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })

        const respData = await respAccess.json()
        changeAccessCode(respData)
    }

    useEffect(
        () => {
            changeCode(urlParams.get('code'))
            if (spotifyCode !== "" && accessCode === null) {
                getAccess()
            }
        }, [spotifyCode, urlParams])

    const modifyTrack = async props => {
        let resp = await fetch("https://api.spotify.com/v1/me/player/" + props, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessCode.access_token
            }
        })
    }


    return (
        <div className={"displaySpotifyData"}>
            <p className={"devices"}>{dataSpotify}</p>
            <div className={"buttons"}>
                {accessCode !== null && <button onClick={() => modifyTrack("previous")}>Prev</button>}
                {accessCode !== null && <button onClick={() => modifyTrack("next")}>Skip</button>}
            </div>
        </div>
    )
}

export default CurrPlaying