import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect, useContext, createContext, } from "react";
import { createClient } from "@openauthjs/openauth/client";
const client = createClient({
    clientID: "web",
    issuer: import.meta.env.VITE_AUTH_URL,
});
const AuthContext = createContext({});
export function AuthProvider({ children }) {
    const initializing = useRef(true);
    const [loaded, setLoaded] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const token = useRef(undefined);
    const [userId, setUserId] = useState();
    useEffect(() => {
        const hash = new URLSearchParams(location.search.slice(1));
        const code = hash.get("code");
        const state = hash.get("state");
        if (!initializing.current) {
            return;
        }
        initializing.current = false;
        if (code && state) {
            callback(code, state);
            return;
        }
        auth();
    }, []);
    async function auth() {
        const token = await refreshTokens();
        if (token) {
            await user();
        }
        setLoaded(true);
    }
    async function refreshTokens() {
        const refresh = localStorage.getItem("refresh");
        if (!refresh)
            return;
        const next = await client.refresh(refresh, {
            access: token.current,
        });
        if (next.err)
            return;
        if (!next.tokens)
            return token.current;
        localStorage.setItem("refresh", next.tokens.refresh);
        token.current = next.tokens.access;
        return next.tokens.access;
    }
    async function getToken() {
        const token = await refreshTokens();
        if (!token) {
            await login();
            return;
        }
        return token;
    }
    async function login() {
        const { challenge, url } = await client.authorize(location.origin, "code", {
            pkce: true,
        });
        sessionStorage.setItem("challenge", JSON.stringify(challenge));
        location.href = url;
    }
    async function callback(code, state) {
        console.log("callback", code, state);
        const challenge = JSON.parse(sessionStorage.getItem("challenge"));
        if (code) {
            if (state === challenge.state && challenge.verifier) {
                const exchanged = await client.exchange(code, location.origin, challenge.verifier);
                if (!exchanged.err) {
                    token.current = exchanged.tokens?.access;
                    localStorage.setItem("refresh", exchanged.tokens.refresh);
                }
            }
            window.location.replace("/");
        }
    }
    async function user() {
        const res = await fetch(`${import.meta.env.VITE_API_URL}me`, {
            headers: {
                Authorization: `Bearer ${token.current}`,
            },
        });
        if (res.ok) {
            const user = await res.json();
            setUserId(user.userId);
            setLoggedIn(true);
        }
    }
    function logout() {
        localStorage.removeItem("refresh");
        token.current = undefined;
        window.location.replace("/");
    }
    return (_jsx(AuthContext.Provider, { value: {
            login,
            logout,
            userId,
            loaded,
            loggedIn,
            getToken,
        }, children: children }));
}
export function useAuth() {
    return useContext(AuthContext);
}
