import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import PromptHandler from './prompt_handler';

const OPEN_ID = 'openid'
const REDIRECT_URI = 'http://localhost:3000/redirectEndpoint'
const CLIENT_ID = 'truauth-client'
const RESPONSE_TYPE = 'code'
const state = 'who cares'

const shouldPrompt = true

const REQUESTED_SCOPES = [OPEN_ID, "profile", "sso"]
const scopeURIFragment = REQUESTED_SCOPES.join(',')


export default () => {
  const [token, setToken] = useState(null);
  const { pathname } = window.location;

  let authorizationCode = "";
  const URLParams = new URLSearchParams(window.location.search);
  if (pathname == '/redirectEndpoint') {

    authorizationCode = URLParams.get("code");
  } 

  const fetchToken = async () => {
    const response = await getToken(authorizationCode);
    setToken(response);
  }

  return (
    <div className="App">
      <header className="App-header">
        {pathname == "/auth" &&
          (
            <Auth />
          )

        }
        {
          pathname == "/cb" && (
            <PromptHandler />
          )
        }
        {
          pathname === "/redirectEndpoint" && (
            <Rte URLParams={URLParams} fetchToken={fetchToken} token={token}/>
          )}
      </header>
    </div>
  );
}

const Rte = ({ URLParams, fetchToken, token }) => {
  if(URLParams.get("code") !== 'null') {
    return (
      <section>
      <a href="#" onClick={fetchToken}>
        Get Token
      </a>
      <p>
        { token }
      </p>
    </section>
    )
  }

  return <>
  <div>
  token: { URLParams.get("token") }
  </div>
  <div>
  refresh token:  { URLParams.get("refresh_token") }
  </div>
  </>

}

const Auth = () => (
  <>
     <button onClick={handlePromtSSO}>  Test SSO </button>
    {
shouldPrompt ? (
  <>
    <button onClick={handlePromt}>  Do it! </button>
  </>
) :
  (
    <>
      <a href={`http://localhost:4820/auth?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopeURIFragment}&state=${state}`}>
        Authenticate with Truth
      </a>
    </>
  )
    }
  </>
)
const handlePromtSSO = () => {
  const win = window.open(
    `http://localhost:4820/auth?response_type=token&client_id=${CLIENT_ID}&redirect_uri=http://localhost:3000/cb&scope=${scopeURIFragment}&state=${state}`,
    "_blank",
    "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400"
  )

  win.focus()
}

const handlePromt = () => {
  const win = window.open(
    `http://localhost:4820/auth?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&redirect_uri=http://localhost:3000/cb&scope=${scopeURIFragment}&state=${state}`,
    "_blank",
    "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400"
  )

  win.focus()
}

// This event hander will listen for messages from the child
window.addEventListener('message', function(e) {
	processRequest(e.data);
} , false);

function processRequest(request) {
  console.log(request)
  if(request.valid == true) {
    window.location = `${REDIRECT_URI}?code=${request.code}&token=${request.token}&refresh_token=${request.refreshToken}`
  }
}

const getToken = async authCode => {
  const response = await fetch('http://localhost:4821/code', {
    method: "POST",
    body: JSON.stringify({
      authorizationCode: authCode
    })
  });
  try {
    const response = await response.json();
    return response;
  } catch (e) {
    return await response.text();
  }
}