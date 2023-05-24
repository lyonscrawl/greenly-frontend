import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import openSocket from "socket.io-client";
// const ENDPOINT = "http://localhost:8080";
const ENDPOINT = "https://greenly-backend.onrender.com"
const socket = openSocket(ENDPOINT, { transports: ['websocket'] });

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    // console.log(email, password)
    socket.emit("signin", {
      "email" : email,
      "password" : password,
    })
    // navigate('/dashboard', { replace: true });
  };

  // USE EFFECT
  useEffect(() => {
    socket.on("signin_result", ({signin_result, id}) => {
      // console.log(socket.id, id)
      if(socket.id === id){
        if(signin_result === 0){
          navigate('/dashboard');
        } else if (signin_result === 1) {
          alert("Wrong Email or Password !")
        } else {
          alert("Someone is already connected !")
        }
      }
    }, []);
  }, [navigate]);

  return (
    <>
      <Stack spacing={3}>
        <TextField 
          name="email" 
          label="Email address" 
          value={email} 
          onChange={(e)=>{setEmail(e.target.value)}} 
        />

        <TextField
          name="password"
          label="Password"
          value={password}
          type={showPassword ? 'text' : 'password'}
          onChange={(e)=>{setPassword(e.target.value)}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
