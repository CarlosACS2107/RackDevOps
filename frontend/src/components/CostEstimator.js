import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export default function CostEstimator({ pcs, servers, cameras, phones, cameraptz, printers, nas, accessPoints, antenasptp, antenasptmp, routersTopo, switches24, switches48, poeSwitches24, poeSwitches48, rackSize, routerCore, firewalls, aps, }) {
    const [equipos, setEquipos] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    // Cálculo de cantidades derivadas (UPS, patch, cableado)
    const totalEquipos = pcs + servers + cameras + phones + cameraptz + printers +
        nas + accessPoints + antenasptp + antenasptmp + routersTopo +
        switches24 + switches48 + poeSwitches24 + poeSwitches48 +
        routerCore + firewalls + aps;
    const upsCount = Math.max(1, Math.ceil(totalEquipos / 20));
    const patchCount = Math.max(1, switches24 + switches48 + poeSwitches24 + poeSwitches48);
    const cablesCount = Math.max(1, Math.ceil(totalEquipos / 10));
    useEffect(() => {
        async function cargarCotizacion() {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:3000/api/cotizacion", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        equipos: [
                            { codigo: "pc", cantidad: pcs },
                            { codigo: "servidor", cantidad: servers },
                            { codigo: "camera", cantidad: cameras },
                            { codigo: "phone", cantidad: phones },
                            { codigo: "cameraptz", cantidad: cameraptz },
                            { codigo: "printer", cantidad: printers },
                            { codigo: "nas", cantidad: nas },
                            { codigo: "accesspoint", cantidad: accessPoints },
                            { codigo: "antenaPTP", cantidad: antenasptp },
                            { codigo: "antenaPTMP", cantidad: antenasptmp },
                            { codigo: "router", cantidad: routersTopo }, // topología
                            { codigo: "switch24", cantidad: switches24 },
                            { codigo: "switch48", cantidad: switches48 },
                            { codigo: "switchPoe24", cantidad: poeSwitches24 },
                            { codigo: "switchPoe48", cantidad: poeSwitches48 },
                            { codigo: "router", cantidad: routerCore }, // core
                            { codigo: "firewall", cantidad: firewalls },
                            { codigo: "accessPoint", cantidad: aps },
                            { codigo: "rack", cantidad: 1 },
                            { codigo: "ups", cantidad: upsCount },
                            { codigo: "patchPanel", cantidad: patchCount },
                            { codigo: "cableado", cantidad: cablesCount },
                        ].filter(e => e.cantidad > 0)
                    })
                });
                const data = await response.json();
                if (!response.ok)
                    throw new Error(data.message);
                setEquipos(data.equipos);
                setTotal(data.total);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        }
        cargarCotizacion();
    }, [
        pcs, servers, cameras, phones, cameraptz, printers, nas,
        accessPoints, antenasptp, antenasptmp, routersTopo,
        switches24, switches48, poeSwitches24, poeSwitches48,
        routerCore, firewalls, aps
    ]);
    function fmt(numero) {
        return numero.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
            maximumFractionDigits: 2
        });
    }
    return (_jsxs("div", { children: [_jsx("p", { style: {
                    margin: "0 0 12px",
                    fontSize: 11,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em"
                }, children: "Estimaci\u00F3n de Costos (MXN)" }), loading && _jsx("p", { style: { color: "white" }, children: "Cargando cotizaci\u00F3n..." }), _jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: equipos.map((equipo) => (_jsxs("div", { style: {
                        display: "grid",
                        gridTemplateColumns: "1fr auto auto",
                        gap: 8,
                        alignItems: "center",
                        fontSize: 11,
                        padding: "5px 0",
                        borderBottom: "1px solid #1e293b"
                    }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [_jsx("img", { src: equipo.imagen, alt: equipo.nombre, style: {
                                        width: 40,
                                        height: 40,
                                        objectFit: "contain",
                                        borderRadius: 6,
                                        background: "#fff",
                                        padding: 2
                                    } }), _jsxs("div", { children: [_jsx("div", { style: { color: "#e2e8f0" }, children: equipo.nombre }), _jsx("div", { style: { color: "#64748b", fontSize: 10 }, children: equipo.categoria })] })] }), _jsxs("span", { style: { color: "#94a3b8" }, children: ["x", equipo.cantidad] }), _jsx("span", { style: {
                                background: "linear-gradient(to right, #00FF00, #00FFFF)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontFamily: "Consolas, monospace",
                                textAlign: "right"
                            }, children: fmt(equipo.subtotal) })] }, equipo.codigo))) }), _jsxs("div", { style: {
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid #334155",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }, children: [_jsx("span", { style: {
                            fontSize: 12,
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: "bold"
                        }, children: "Total estimado" }), _jsx("span", { style: {
                            fontSize: 20,
                            fontWeight: "bold",
                            fontFamily: "Consolas, monospace",
                            color: "#00ffff"
                        }, children: fmt(total) })] })] }));
}
