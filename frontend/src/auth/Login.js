import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const iniciarSesion = async () => {
        try {
            const respuesta = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo,
                    password
                })
            });
            const data = await respuesta.json();
            if (!data.success) {
                alert(data.message);
                return;
            }
            login(data.user, data.token);
            navigate("/", { replace: true });
        }
        catch (error) {
            alert("No fue posible iniciar sesión.");
        }
    };
    return (_jsx("div", { style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "#f4f4f4"
        }, children: _jsxs("div", { style: {
                width: "350px",
                background: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0,0,0,.2)"
            }, children: [_jsx("h1", { style: {
                        textAlign: "center"
                    }, children: "RackDynamics" }), _jsx("input", { type: "email", placeholder: "Correo", value: correo, onChange: (e) => setCorreo(e.target.value), style: {
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px"
                    } }), _jsx("input", { type: "password", placeholder: "Contrase\u00F1a", value: password, onChange: (e) => setPassword(e.target.value), style: {
                        width: "100%",
                        padding: "10px",
                        marginBottom: "20px"
                    } }), _jsx("button", { onClick: iniciarSesion, style: {
                        width: "100%",
                        padding: "10px",
                        cursor: "pointer"
                    }, children: "Iniciar sesi\u00F3n" }), _jsx("hr", { style: {
                        margin: "20px 0"
                    } }), _jsx("button", { onClick: () => navigate("/register"), style: {
                        width: "100%",
                        padding: "10px",
                        cursor: "pointer"
                    }, children: "Crear cuenta" })] }) }));
}
