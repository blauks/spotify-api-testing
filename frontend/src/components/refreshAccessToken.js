import staticData from "../resources/staticData"
import secrets from "../resources/secrets"

const Refresh = async () => {
    let tokenData = new URLSearchParams(window.location.search);
    tokenData.append("grant_type", "refresh_token")
    tokenData.append("refresh_token", localStorage.getItem("refresh_token"))
    tokenData.append("client_id", staticData.client_id)
    tokenData.append("client_secret", secrets.clientSecret)

    let respRefresh = await fetch("https://accounts.spotify.com/api/token", {
        method: 'POST',
        body: tokenData,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })

    const respRefreshData = await respRefresh.json()
    localStorage.setItem("access_token", respRefreshData.access_token)
    localStorage.setItem("refresh_token", respRefreshData.refresh_token)
}

export default Refresh;