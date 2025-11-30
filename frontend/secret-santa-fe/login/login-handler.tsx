import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function handleLogin(userName: string, password: string,
    setUserNameError: (error: boolean) => void, setPasswordError: (error: boolean) => void,
    router: { push: (path: string) => void }) {
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
        callBackendLoginAPI(userName, password).then(({ authenticated, token }) => {
            if (authenticated) {
                Cookies.set('authenticated', 'true');
                if (token) {
                    Cookies.set('token', token);
                }
                router.push('/');
            } else {
                setPasswordError(true);
            }
        });
    }
}

function callBackendLoginAPI(userName: string, password: string): Promise<{ authenticated: boolean, token?: string }> {
    return fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName, password: password }),
        credentials: 'include',
    })
        .then(response => response.json())
        .then(data => {
            return { authenticated: data.authenticated as boolean, token: data.token as string | undefined };
        })
        .catch(error => {
            console.error('Error during login:', error);
            return { authenticated: false, token: undefined };
        });
}