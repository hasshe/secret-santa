'use client';
import { Button, InputAdornment, TextField } from "@mui/material";
import Cookies from 'js-cookie';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockPersonIcon from '@mui/icons-material/LockPerson';

export default function LoginPage() {
    const handleLogin = () => {
        Cookies.set('authenticated', 'true');
        window.location.href = '/';
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <TextField id="username-field" label="Username" variant="standard" slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    ),
                },
            }} />
            <TextField id="password-field" label="Password" variant="standard" type="password" slotProps={{
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