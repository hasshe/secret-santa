'use client';
import { Button, InputAdornment, TextField } from "@mui/material";
import Cookies from 'js-cookie';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [userNameError, setUserNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleLogin = () => {
        let hasError = false;

        if (!userName.trim()) {
            setUserNameError(true);
            hasError = true;
        } else {
            setUserNameError(false);
        }

        if (!password.trim()) {
            setPasswordError(true);
            hasError = true;
        } else {
            setPasswordError(false);
        }

        if (!hasError) {
            Cookies.set('authenticated', 'true');
            router.push('/');
        }
    };
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
            <Button variant="contained" color="primary" onClick={handleLogin} sx={{ marginTop: '20px', fontWeight: 'bold', backgroundColor: 'white', color: 'red', '&:hover': { backgroundColor: '#d12020ff' } }}>
                Login
            </Button>
        </div>
    );
}