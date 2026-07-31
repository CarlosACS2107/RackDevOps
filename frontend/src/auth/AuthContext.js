import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);
    const login = (usuario, nuevoToken) => {
        setUser(usuario);
        setToken(nuevoToken);
        localStorage.setItem("token", nuevoToken);
        localStorage.setItem("user", JSON.stringify(usuario));
    };
    const register = (usuario, nuevoToken) => {
        login(usuario, nuevoToken);
    };
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            token,
            login,
            logout,
            register
        }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}
