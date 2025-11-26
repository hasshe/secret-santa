'use client';
import { Button, InputAdornment, TextField } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { handleLogin } from "../../login/login-handler";
import Cookies from "js-cookie";

export default function LoginPage() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [userNameError, setUserNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleLoginClick = () => {
        handleLogin(userName, password, setUserNameError, setPasswordError, router);
    }

    useEffect(() => {
        const authStatus = Cookies.get('authenticated');
        const token = Cookies.get('token');
        if (authStatus === 'true' && token !== undefined) {
            fetch('http://localhost:3000/verify-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.valid && authStatus === 'true') {
                        router.push('/');
                        return;
                    }
                })
                .catch(error => {
                    console.error('Error verifying token:', error);
                });
        }
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <TextField id="username-field" label="Username" variant="standard" value={userName} required
                error={userNameError}
                onChange={(e) => {
                    setUserName(e.target.value)
                    setUserNameError(false)
                }} slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        ),
                    },
                }} />
            <TextField id="password-field" label="Password" variant="standard" type="password" value={password} required
                error={passwordError}
                onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError(false)
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockPersonIcon />
                            </InputAdornment>
                        ),
                    },
                }} />
            <Button variant="contained" color="primary" onClick={handleLoginClick} sx={{ marginTop: '20px', fontWeight: 'bold', backgroundColor: 'white', color: 'red', '&:hover': { backgroundColor: '#d12020ff' } }}>
                Login
            </Button>
        </div>
    );
}