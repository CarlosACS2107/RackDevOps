import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Home() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState("");
    const loadProjects = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:3000/projects", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProjects(res.data);
        }
        catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        loadProjects();
    }, []);
    const createProject = async () => {
        if (!projectName.trim()) {
            alert("Escribe un nombre para el proyecto");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            // Mostramos en consola lo que estamos enviando
            console.log("Enviando petición a /projects con:", { nombre: projectName });
            const res = await axios.post("http://localhost:3000/projects", {
                nombre: projectName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Respuesta del servidor:", res.data);
            localStorage.setItem("projectId", res.data.id);
            navigate("/project");
        }
        catch (error) {
            console.error("Error completo:", error);
            // Mostrar mensaje de error detallado
            let mensaje = "Error al crear proyecto";
            if (error.response) {
                // El servidor respondió con un error
                mensaje = `Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
                console.log("Datos del error:", error.response.data);
            }
            else if (error.request) {
                // No hubo respuesta del servidor
                mensaje = "No se pudo conectar con el servidor. ¿Está corriendo el backend?";
            }
            else {
                mensaje = error.message;
            }
            alert(mensaje);
        }
    };
    const openProject = (id) => {
        localStorage.setItem("projectId", id.toString());
        navigate("/project");
    };
    const deleteProject = async (id) => {
        const confirmar = window.confirm("¿Deseas eliminar este proyecto?");
        if (!confirmar)
            return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/projects/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            loadProjects();
        }
        catch (error) {
            console.error(error);
            alert("Error al eliminar proyecto");
        }
    };
    return (_jsx("div", { style: {
            minHeight: "100vh",
            background: "#163257",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white"
        }, children: _jsxs("div", { style: {
                width: "600px",
                padding: "30px",
                borderRadius: "12px",
                background: "#0b1728"
            }, children: [_jsx("h1", { children: "RackDynamics" }), _jsx("h3", { children: "Crear Proyecto" }), _jsx("input", { type: "text", placeholder: "Nombre del proyecto", value: projectName, onChange: (e) => setProjectName(e.target.value), style: {
                        width: "100%",
                        padding: "12px",
                        marginBottom: "10px",
                        borderRadius: "6px",
                        border: "1px solid #334155",
                        background: "#1a2332",
                        color: "white"
                    } }), _jsx("button", { onClick: createProject, style: {
                        width: "100%",
                        padding: "15px",
                        marginBottom: "25px",
                        cursor: "pointer",
                        background: "#00d9ff",
                        color: "#0b1728",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "bold"
                    }, children: "Crear Proyecto" }), _jsx("h3", { children: "Proyectos Guardados" }), projects.length === 0
                    ? (_jsx("p", { children: "No hay proyectos guardados." }))
                    : (projects.map((project) => (_jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px",
                            marginBottom: "10px",
                            background: "#1e293b",
                            borderRadius: "8px"
                        }, children: [_jsx("span", { children: project.nombre }), _jsxs("div", { style: {
                                    display: "flex",
                                    gap: "10px"
                                }, children: [_jsx("button", { onClick: () => openProject(project.id), style: {
                                            cursor: "pointer",
                                            borderRadius: "4px",
                                            padding: "6px 12px",
                                            background: "#00d9ff",
                                            border: "none",
                                            color: "#0b1728",
                                            fontWeight: "bold"
                                        }, children: "Abrir" }), _jsx("button", { onClick: () => deleteProject(project.id), style: {
                                            background: "#dc2626",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 12px",
                                            cursor: "pointer",
                                            borderRadius: "4px"
                                        }, children: "Eliminar" })] })] }, project.id))))] }) }));
}
