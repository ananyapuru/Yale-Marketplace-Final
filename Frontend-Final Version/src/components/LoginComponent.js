import React from 'react';
import logo from './logo.png';
import '../pages/Login.css'

export default function LoginComponent() {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: '300px', height: 'auto', marginBottom: '50px' }} />
        <h1 style={{ color: 'white', fontSize: '5em', fontFamily: 'serif', textAlign: 'center' }}>Welcome to Yale Marketplace</h1>
        <form action="http://127.0.0.1:5000/login/oauth" method="get">
          <input type="submit" value="Login with Google" style={{ marginTop: '50px', width: '200px', height: '60px', fontSize: '1.2em' }} />
        </form>
        <p style={{ color: '#c2c2c2', marginTop: '20px', fontStyle: 'italic', fontFamily: 'Georgia', fontSize: '1.2em', textAlign: 'center' }}>Please sign in using your Yale credentials</p>
      </div>
    </>
  )
}
