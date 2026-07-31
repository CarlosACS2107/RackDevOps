import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
export default function Register() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const navigate = useNavigate();
    const { register } = useAuth();
    const crearCuenta = async () => {
        console.log("1. Entró a crearCuenta");
        if (password !== confirmar) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        console.log("2. Contraseñas correctas");
        try {
            console.log("3. Enviando petición...");
            const respuesta = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    correo,
                    password
                })
            });
            console.log("4. Status:", respuesta.status);
            const data = await respuesta.json();
            console.log("5. Respuesta:", data);
            if (!data.success) {
                alert(data.message);
                return;
            }
            console.log("6. Registro correcto");
            register(data.user, data.token);
            navigate("/");
        }
        catch (error) {
            console.error("ERROR:", error);
            alert("No fue posible registrar la cuenta.");
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
                    }, children: "Crear cuenta" }), _jsx("hr", { style: {
                        margin: "20px 0"
                    } }), _jsx("button", { onClick: () => navigate("/login"), style: {
                        width: "100%",
                        padding: "10px",
                        cursor: "pointer"
                    }, children: "Volver al Login" }), _jsx("input", { type: "text", placeholder: "Nombre", value: nombre, onChange: (e) => setNombre(e.target.value), style: {
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px"
                    } }), _jsx("input", { type: "email", placeholder: "Correo", value: correo, onChange: (e) => setCorreo(e.target.value), style: {
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px"
                    } }), _jsx("input", { type: "password", placeholder: "Contrase\u00F1a", value: password, onChange: (e) => setPassword(e.target.value), style: {
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px"
                    } }), _jsx("input", { type: "password", placeholder: "Confirmar contrase\u00F1a", value: confirmar, onChange: (e) => setConfirmar(e.target.value), style: {
                        width: "100%",
                        padding: "10px",
                        marginBottom: "20px"
                    } }), _jsx("button", { onClick: () => {
                        alert("Botón presionado");
                        crearCuenta();
                    }, style: {
                        width: "100%",
                        padding: "10px",
                        cursor: "pointer"
                    }, children: "Crear cuenta" })] }) }));
}
