import React, { useEffect, useState } from 'react';
import Refresh from './refreshAccessToken';
import staticData from '../resources/staticData';

const Me = props => {

    const [profileInfo, changeProfileInfo] = useState("")

    const getProfile = async () => {
        let respProfile = await fetch("https://api.spotify.com/v1/me", {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        })
        const meData = await respProfile.json()
        changeProfileInfo(meData)
        if (respProfile.status !== 200) {
            Refresh()
        }
    }

    useEffect(() => {
        if (profileInfo === "") {
            getProfile()
        }
    }, [profileInfo])

    return (
        <div className={"meSection"}>
            <img alt="Flagg" src={"https://www.countryflags.io/" + profileInfo.country + "/flat/64.png"} />
            <p>{profileInfo.id}</p>
        </div>
    )
}

export default Me;