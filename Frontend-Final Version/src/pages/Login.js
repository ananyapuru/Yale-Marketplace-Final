import React from 'react'
import './Login.css'
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import LoginComponent from '../components/LoginComponent';


export default function Login() {
  
  return (
    <div className='yale'>
      <Box
        className="ripple-background"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <LoginComponent />
        <Box className="circle xxlarge shade1" />
        <Box className="circle xlarge shade2" />
        <Box className="circle large shade3" />
        <Box className="circle mediun shade4" />
        <Box className="circle small shade5" />
      </Box>
    </div>
  );
}
