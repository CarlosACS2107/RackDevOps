import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/index";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { useAuth } from "./auth/AuthContext";
export default function App() {
    const { token } = useAuth();
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: token
                    ? _jsx(Navigate, { to: "/" })
                    : _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: token
                    ? _jsx(Navigate, { to: "/" })
                    : _jsx(Register, {}) }), _jsx(Route, { path: "/", element: token
                    ? _jsx(Home, {})
                    : _jsx(Navigate, { to: "/login" }) }), _jsx(Route, { path: "/project", element: token
                    ? _jsx(Index, {})
                    : _jsx(Navigate, { to: "/login" }) })] }));
}
