import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import "./App.css";
function App() {
    const auth = useAuth();
    const [status, setStatus] = useState("");
    async function callApi() {
        const res = await fetch(`${import.meta.env.VITE_API_URL}me`, {
            headers: {
                Authorization: `Bearer ${await auth.getToken()}`,
            },
        });
        setStatus(res.ok ? await res.text() : "error");
    }
    return !auth.loaded ? (_jsx("div", { children: "Loading..." })) : (_jsx("div", { children: auth.loggedIn ? (_jsxs("div", { children: [_jsxs("p", { children: [_jsx("span", { children: "Logged in" }), auth.userId && _jsxs("span", { children: [" as ", auth.userId] })] }), status !== "" && _jsxs("p", { children: ["API call: ", status] }), _jsxs("div", { className: "controls", children: [_jsx("button", { onClick: callApi, children: "Call API" }), _jsx("button", { onClick: auth.logout, children: "Logout" })] })] })) : (_jsx("button", { onClick: auth.login, children: "Login with OAuth" })) }));
}
export default App;
