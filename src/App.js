import React from 'react';
import logo from './logo.svg';
import './App.css';

import PromptHandler from './prompt_handler';

const OPEN_ID = 'openid'
const REDIRECT_URI = 'http://localhost:3000/redirectEndpoint'
const CLIENT_ID = 'truauth-client'
const RESPONSE_TYPE = 'code'
const state = 'who cares'

const shouldPrompt = true

const REQUESTED_SCOPES = [OPEN_ID, "profile"]
const scopeURIFragment = REQUESTED_SCOPES.join(',')


export default () => {
  const { pathname } = window.location;

  let authorizationCode = "";
  if (pathname == '/redirectEndpoint') {
    const URLParams = new URLSearchParams(window.location.search);
    authorizationCode = URLParams.get("code");
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
          pathname === "/redirectEndpoint" &&
          <section>
            <a href="#" onClick={() => getToken(authorizationCode)}>
              Get Token
            </a>
          </section>
        }
      </header>
    </div>
  );
}

const Auth = () => {
  return shouldPrompt ? (
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
  if(request.valid == true) {
    window.location = `${REDIRECT_URI}?code=${request.code}`
  }
}

const getToken = async authCode => {
  fetch('http://localhost:4821/code', {
    method: "POST",
    body: JSON.stringify({
      authorizationCode: authCode
    })
  });
}
