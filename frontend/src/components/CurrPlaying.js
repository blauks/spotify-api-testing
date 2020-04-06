import React, { useState, useEffect } from 'react';
import secrets from '../resources/secrets';
import staticData from '../resources/staticData';
import Refresh from './refreshAccessToken'

const CurrPlaying = props => {
    const [spotifyCode, changeCode] = useState("");
    const [accessCode, changeAccessCode] = useState("")
    const [dataSpotify, changeDataSpotify] = useState()

    const urlParams = new URLSearchParams(window.location.search);

    const getAccess = async () => {
        let tokenData = new URLSearchParams()
        if (localStorage.getItem("access_token") !== null) {
            tokenData.append("grant_type", "authorization_code")
            tokenData.append("code", spotifyCode)
            tokenData.append("redirect_uri", "http://localhost:3000/callback")
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
            console.log(respData)
            localStorage.setItem("access_token", respData.access_token)
            localStorage.setItem("refresh_token", respData.refresh_token)
            return respAccess.status
        }
        else {
            Refresh()
        }
    }

    useEffect(
        () => {
            changeCode(urlParams.get('code'))
            if (spotifyCode !== "" && accessCode === "") {
                getAccess()
                changeAccessCode(localStorage.getItem("access_token"))
            }
        }, [spotifyCode, urlParams, accessCode])

    const modifyTrack = async props => {
        let resp = await fetch("https://api.spotify.com/v1/me/player/" + props, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            }
        })
        if (resp.status == 401) {
            Refresh()
        }
    }


    return (
        <div className={"displaySpotifyData"}>
            <p className={"devices"}>{dataSpotify}</p>
            <div className={"buttons"}>
                {accessCode !== "" && <button onClick={() => modifyTrack("previous")}>Prev</button>}
                {accessCode !== "" && <button onClick={() => modifyTrack("next")}>Skip</button>}
            </div>
        </div >
    )
}

export default CurrPlaying