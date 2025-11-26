'use client';
import { Button, InputAdornment, TextField } from "@mui/material";
import Cookies from 'js-cookie';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { useState } from "react";

export default function LoginPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <TextField id="username-field" label="Username" variant="standard" value={userName} onChange={(e) => setUserName(e.target.value)} slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    ),
                },
            }} />
            <TextField id="password-field" label="Password" variant="standard" type="password" value={password} onChange={(e) => setPassword(e.target.value)} slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <LockPersonIcon />
                        </InputAdornment>
                    ),
                },
            }} />
            <Button variant="contained" color="primary" onClick={() => handleLogin(userName, password)} sx={{ marginTop: '20px', fontWeight: 'bold', backgroundColor: 'white', color: 'red', '&:hover': { backgroundColor: '#d12020ff' } }}>
                Login
            </Button>
        </div>
    );
}

function handleLogin(userName?: string, password?: string) {
    Cookies.set('authenticated', 'true');
    window.location.href = '/';
}