import React, { useEffect } from 'react';

export default () => {
    useEffect(() => {
        sendToParent()
    }, [])
    return null
}

const sendToParent = () => {
    const URLParams = new URLSearchParams(window.location.search);

    const s = {
        valid: true,
        code: URLParams.get("code")
    }
    window.opener.postMessage(s);
    window.close()
}


