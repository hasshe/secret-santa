'use client';
import { Button } from "@mui/material";
import Cookies from 'js-cookie';

export default function LoginPage() {
    const handleLogin = () => {
        Cookies.set('authenticated', 'true');
        window.location.href = '/';
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1>Login Page</h1>
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
            </Button>
        </div>
    );
}