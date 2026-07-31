import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import axios from "axios";
export default function NewProject() {
    const [name, setName] = useState("");
    const createProject = async () => {
        await axios.post("http://localhost:3000/projects", {
            name
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx("input", { value: name, onChange: (e) => setName(e.target.value) }), _jsx("button", { onClick: createProject, children: "Crear" })] }));
}
