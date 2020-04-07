import React, { useState, useEffect } from 'react';
import secrets from '../resources/secrets';
import staticData from '../resources/staticData';
import Refresh from './refreshAccessToken'

const CurrPlaying = props => {
    const [spotifyCode, changeCode] = useState("");
    const [accessCode, changeAccessCode] = useState("")
    const [playingNow, changePlayingNow] = useState({
        item: {
            album: {
                images: ["bilde"],
                artists: ["navn"]
            }
        }
    })
    const [currPlayingInterval, changeCurrPlayingInterval] = useState("")

    const urlParams = new URLSearchParams(window.location.search);

    const getAccess = async props => {
        if (spotifyCode !== localStorage.getItem('code')) {
            let tokenData = new URLSearchParams()
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
            localStorage.setItem("access_token", respData.access_token)
            localStorage.setItem("refresh_token", respData.refresh_token)
            return respAccess.status
        }
    }

    useEffect(
        () => {
            changeCode(urlParams.get('code'))
            if (spotifyCode !== "" && accessCode === "") {
                getAccess()
                localStorage.setItem("code", urlParams.get('code'))
                changeAccessCode(localStorage.getItem("access_token"))
                getCurrentlyPlaying()
                setInterval(() => {
                    getCurrentlyPlaying()
                }, 3500);
            }
        }, [spotifyCode, urlParams, accessCode, playingNow])

    const modifyTrack = async props => {
        let resp = await fetch("https://api.spotify.com/v1/me/player/" + props.endpoint, {
            method: props.method,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access_token")
            },
        })
        if (resp.status === 401) {
            Refresh()
        }
        else {
            getCurrentlyPlaying()
        }
    }

    const getCurrentlyPlaying = async () => {
        let resp = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        })
        if (resp.status === 401) {
            Refresh()
        }
        else {
            const currPlayingData = await resp.json()
            changePlayingNow(currPlayingData)
        }
    }

    if (accessCode !== "") {
        return (
            <div className={"displaySpotifyData"}>
                <div className={"playingDiv"}>
                    <img alt="Sangbilde" src={playingNow.item.album.images[0].url} />
                    <p className={"songInfo"}>{playingNow.item.album.name} - {playingNow.item.album.artists.map(function (d, i) {
                        return (i === 0 ? "" : ", ") + d.name
                    })}</p>
                </div>
                <div className={"buttons"}>
                    <button onClick={() => modifyTrack({ endpoint: "previous", method: "POST" })}>Prev</button>
                    <button onClick={() => modifyTrack({ endpoint: playingNow.is_playing ? "pause" : "play", method: "PUT" })}>{playingNow.is_playing ? "Pause" : "Resume"}</button>
                    <button onClick={() => modifyTrack({ endpoint: "next", method: "POST" })}>Skip</button>
                </div>
            </div >
        )
    }
    else {
        return (
            <div></div>
        )
    }
}

export default CurrPlaying