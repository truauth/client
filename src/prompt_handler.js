import React, { useEffect } from 'react';

export default () => {
    useEffect(() => {
        sendToParent()
    }, [])
    return null
}

const sendToParent = () => {
    const URLParams = new URLSearchParams(window.location.search);

    const code = URLParams.get("code");
    const token = URLParams.get("token");
    const refreshToken = URLParams.get("refresh_token")

    const s = {
        valid: true,
        code,
        token,
        refreshToken,
    }
    window.opener.postMessage(s);
    window.close()
}