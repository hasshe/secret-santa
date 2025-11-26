import Cookies from "js-cookie";

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
        callBackendLoginAPI(userName, password).then(authenticated => {
            if (authenticated) {
                Cookies.set('authenticated', 'true');
                router.push('/');
            } else {
                setPasswordError(true);
            }
        });
    }
}

function callBackendLoginAPI(userName: string, password: string): Promise<boolean> {
    return fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName, password: password }),
    })
        .then(response => response.json())
        .then(data => {
            return data.authenticated as boolean;
        })
        .catch(error => {
            console.error('Error during login:', error);
            return false;
        });
}