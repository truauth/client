import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';


const OPEN_ID = 'openid'
const REDIRECT_URI = 'http://localhost:3000/redirectEndpoint'
const CLIENT_ID = 'truauth-client'
const RESPONSE_TYPE = 'code'
const state = '1234xyz'

const REQUESTED_SCOPES = [OPEN_ID, "profile"]
const scopeURIFragment = REQUESTED_SCOPES.join(',')


export default () => {
  const [token, setToken] = useState(null);
  const { pathname } = window.location;
  let authorizationCode = "";
  if(pathname == '/redirectEndpoint') {
    const URLParams = new URLSearchParams(window.location.search);
    authorizationCode = URLParams.get("code");
  } 

  const fetchToken = async () => {
    const response = await getToken(authorizationCode);
    setToken(response);
  }

  return (
    <div className="App">
      <header className="App-header">
        { pathname === "/auth" &&
            <a href={`http://localhost:4820/auth?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopeURIFragment}&state=${state}`}>
                Authenticate with Truth
            </a>
        }
        {
          pathname == "/redirectEndpoint" &&
          <section>
            <a href="#" onClick={fetchToken}>
              Get Token
            </a>
            <p>
              { token }
            </p>
          </section>
        }
      </header>
    </div>
  );
}

const getToken = async authCode => {
  const response = await fetch('http://localhost:4821/token', {
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

