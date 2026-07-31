import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState } from 'react';
export const AppContext = createContext({
    theme: "dark",
    toggleTheme: () => { },
});
export function AppProviders({ children }) {
    const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        setTheme(theme === "dark"
            ? "light"
            : "dark");
    };
    return (_jsx(AppContext.Provider, { value: {
            theme,
            toggleTheme
        }, children: _jsx("div", { className: theme, children: children }) }));
}
