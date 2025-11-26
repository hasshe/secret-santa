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
        Cookies.set('authenticated', 'true');
        router.push('/');
    }
}