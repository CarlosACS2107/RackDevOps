import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/index.tsx
import { useState, useMemo, useEffect } from 'react';
import { Monitor, Server, Phone, Printer, HardDrive, Activity, Wifi, Router, Box, ChevronUp, ChevronDown, Cctv, Radio, } from 'lucide-react';
import GlowCard from '@/components/GlowCard';
import InputField from '@/components/InputField';
import StatDisplay from '@/components/StatDisplay';
import RackVisualization from '@/components/RackVisualization';
import NetworkTopology from '@/components/NetworkTopology';
import CostEstimator from '@/components/CostEstimator';
import RecommendationCard from '@/components/RecommendationCard';
import { useNavigate } from "react-router-dom";
import ProjectMenu from "@/components/ProjectMenu";
import axios from "axios";
import { generateRecommendations } from '@/utils/recommendations';
// ── Spinner ──────────────────────────────────────────────────────
function Spinner({ value, onChange, min = 0, max = 99 }) {
    return (_jsxs("div", { style: {
            display: 'flex', alignItems: 'center',
            border: '1px solid #1e293b', borderRadius: 8,
            overflow: 'hidden', background: '#0a1018', width: 80,
        }, children: [_jsx("span", { style: {
                    flex: 1, textAlign: 'center',
                    color: 'white', fontFamily: 'Consolas, monospace', fontSize: 14, padding: '6px 0',
                }, children: value }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', borderLeft: '1px solid #1e293b' }, children: [_jsx("button", { onClick: () => onChange(Math.min(max, value + 1)), style: {
                            padding: '3px 8px', background: 'transparent', border: 'none',
                            color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center',
                        }, children: _jsx(ChevronUp, { size: 12 }) }), _jsx("button", { onClick: () => onChange(Math.max(min, value - 1)), style: {
                            padding: '3px 8px', background: 'transparent',
                            border: 'none', borderTop: '1px solid #1e293b',
                            color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center',
                        }, children: _jsx(ChevronDown, { size: 12 }) })] })] }));
}
export default function Index() {
    const [tab, setTab] = useState('infraestructura');
    const [cfg, setCfg] = useState({
        pcs: 0,
        servers: 0,
        cameras: 0,
        ptz: 0,
        phones: 0,
        printers: 0,
        nas: 0,
        accesspoints: 0,
        ptp: 0,
        ptmp: 0,
        sw24: 0,
        sw48: 0,
        poe24: 0,
        poe48: 0,
        routersInfra: 0, // Routers físicos en rack (para rack y costos)
        routersTopo: 0, // Routers que aparecen en la topología (visuales)
        firewalls: 0,
        aps: 0,
    });
    const set = (k) => (v) => setCfg(c => ({ ...c, [k]: v }));
    const [rackSize, setRackSize] = useState('22U');
    const projectId = localStorage.getItem("projectId");
    const navigate = useNavigate();
    const [projectName, setProjectName] = useState("");
    // Guardar proyecto
    const saveProject = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:3000/projects/${projectId}`, { cfg, rackSize }, { headers: { Authorization: `Bearer ${token}` } });
            alert("Proyecto guardado correctamente");
        }
        catch (error) {
            console.error(error);
            alert("Error al guardar proyecto");
        }
    };
    // Cargar proyecto
    useEffect(() => {
        const loadProject = async () => {
            if (!projectId)
                return;
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`http://localhost:3000/projects/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
                if (!res.data)
                    return;
                if (res.data.nombre) {
                    setProjectName(res.data.nombre);
                }
                const data = typeof res.data.configuracion === "string"
                    ? JSON.parse(res.data.configuracion)
                    : res.data.configuracion;
                if (data?.cfg) {
                    setCfg(data.cfg);
                }
                if (data?.rackSize) {
                    setRackSize(data.rackSize);
                }
            }
            catch (error) {
                console.error(error);
            }
        };
        loadProject();
    }, [projectId]);
    const rackU = parseInt(rackSize);
    // Cálculos
    const totalHosts = cfg.pcs + cfg.servers + cfg.cameras + cfg.phones + cfg.printers + cfg.nas + cfg.accesspoints + cfg.ptp + cfg.ptmp;
    const totalPorts = cfg.sw24 * 24 + cfg.sw48 * 48 + cfg.poe24 * 24 + cfg.poe48 * 48;
    const usedPorts = totalHosts + cfg.aps;
    const poeDevices = cfg.cameras + cfg.phones + cfg.ptz + cfg.accesspoints + cfg.ptp + cfg.ptmp;
    const poePorts = cfg.poe24 * 24 + cfg.poe48 * 48;
    const poeWatts = cfg.cameras * 15 + cfg.phones * 8 + cfg.ptz * 30 + cfg.accesspoints * 18 + cfg.ptp * 12 + cfg.ptmp * 18;
    const switchCount = cfg.sw24 + cfg.sw48 + cfg.poe24 + cfg.poe48;
    const utilPct = totalPorts > 0 ? Math.round((usedPorts / totalPorts) * 100) : 0;
    const projected = Math.round(totalHosts * 1.3);
    const ipsAvail = Math.max(254 - totalHosts, 0);
    const subnetLabel = totalHosts <= 30 ? '/27' : totalHosts <= 62 ? '/26' : totalHosts <= 126 ? '/25' : totalHosts <= 254 ? '/24' : totalHosts <= 510 ? '/23' : '/22';
    const bwGbps = (cfg.sw24 * 24 + cfg.sw48 * 48 + cfg.poe24 * 24 + cfg.poe48 * 48).toFixed(0);
    // Reloj (si lo quieres, lo puedes eliminar)
    const [time, setTime] = useState("");
    useEffect(() => {
        const updateTime = () => {
            setTime(new Date().toLocaleTimeString("es-MX", {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);
    // Rack items
    const rackItems = useMemo(() => {
        const items = [];
        for (let i = 0; i < cfg.routersInfra; i++)
            items.push({ type: 'router', units: 1, label: `Router Core ${i + 1}`, model: 'Cisco ISR 4331', status: 'online' });
        for (let i = 0; i < cfg.firewalls; i++)
            items.push({ type: 'firewall', units: 1, label: `Firewall ${i + 1}`, model: 'FortiGate 60F', status: 'online' });
        for (let i = 0; i < Math.min(cfg.servers, 6); i++)
            items.push({ type: 'server', units: 2, label: `Servidor ${i + 1}`, model: 'Dell PowerEdge R750', status: 'online', load: 45 + i * 10 });
        for (let i = 0; i < Math.min(cfg.poe24 + cfg.poe48, 3); i++)
            items.push({ type: 'poe-switch', units: 1, label: `Switch PoE ${i + 1}`, status: 'online' });
        for (let i = 0; i < Math.min(cfg.sw24 + cfg.sw48, 3); i++)
            items.push({ type: 'switch', units: 1, label: `Switch GbE ${i + 1}`, status: 'online' });
        items.push({ type: 'patch-panel', units: 1, label: 'Patch Panel Cat6 48p' });
        items.push({ type: 'ups', units: 2, label: 'UPS 3000VA Online' });
        return items;
    }, [cfg]);
    const usedRackU = rackItems.reduce((a, b) => a + b.units, 0);
    // Consumo total (para el recomendador)
    const totalWatts = Math.round(totalHosts * 25 +
        cfg.servers * 400 +
        (cfg.sw24 + cfg.sw48 + cfg.poe24 + cfg.poe48) * 50 +
        cfg.routersInfra * 200 +
        cfg.firewalls * 150 +
        cfg.aps * 30 +
        cfg.nas * 100);
    // Métricas para el recomendador
    const metrics = {
        totalHosts,
        usedPorts,
        totalPorts,
        poeDevices,
        poePorts,
        poeWatts,
        usedRackU,
        rackU,
        switchCount,
        totalWatts,
    };
    // Generar recomendaciones
    const recommendations = generateRecommendations(cfg, metrics);
    const label = (text, color = '#64748b') => (_jsx("p", { style: { margin: '0 0 8px', fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }, children: text }));
    return (_jsxs("div", { style: { minHeight: '100vh', background: '#163257', color: 'white', fontFamily: 'system-ui, sans-serif' }, children: [_jsxs("header", { style: {
                    position: 'sticky', top: 0, zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 24px',
                    background: 'rgba(7,17,29,0.92)', backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #1e2d42',
                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsx("img", { src: "/image/Logo.png", alt: "RackDevOps", style: { width: 60, height: 60 } }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 14, fontWeight: 'bold', letterSpacing: '0.03em' }, children: "RackDevOps" }), _jsx("div", { style: { fontSize: 9, color: 'cyan', textTransform: 'uppercase', letterSpacing: '0.12em' }, children: "Dise\u00F1o de Infraestructura de Red" })] })] }), _jsxs("div", { style: { display: 'flex', gap: 8, flexWrap: 'wrap' }, children: [_jsx(StatDisplay, { label: "Hosts", value: totalHosts, color: "cyan" }), _jsx(StatDisplay, { label: "Puertos", value: `${usedPorts}/${totalPorts}`, color: "green" }), _jsx(StatDisplay, { label: "PoE", value: poeDevices, color: "orange" }), _jsx(StatDisplay, { label: "Switches", value: switchCount, color: "purple" }), _jsx(StatDisplay, { label: "Uso", value: `${utilPct}%`, color: utilPct > 80 ? 'red' : 'green' }), _jsx(StatDisplay, { label: "Subred", value: subnetLabel, color: "cyan" }), _jsx(StatDisplay, { label: "BW", value: bwGbps, unit: "Gbps", color: "cyan" }), _jsx(StatDisplay, { label: "Rack", value: rackSize, color: "purple" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsxs("div", { style: {
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '6px 12px', borderRadius: 999,
                                    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                                    fontSize: 11, color: '#22c55e',
                                }, children: [_jsx("div", { style: { width: 6, height: 6, borderRadius: '50%', background: '#22c55e' } }), "Sistema Activo"] }), _jsx(ProjectMenu, { projectId: projectId, projectName: projectName, setProjectName: setProjectName, cfg: cfg, rackSize: rackSize })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '300px 1fr 280px', height: 'calc(100vh - 57px)' }, children: [_jsxs("aside", { style: {
                            borderRight: '1px solid #1e2d42', overflowY: 'auto',
                            background: 'rgba(7,17,29,0.6)', padding: 16,
                            display: 'flex', flexDirection: 'column', gap: 12,
                        }, children: [_jsx("div", { style: {
                                    display: 'flex', gap: 4, padding: 4,
                                    background: '#0a1018', borderRadius: 12, border: '1px solid #1e2d42',
                                }, children: ['dispositivos', 'infraestructura'].map(t => (_jsx("button", { onClick: () => setTab(t), style: {
                                        flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none',
                                        cursor: 'pointer', fontSize: 10, textTransform: 'uppercase',
                                        letterSpacing: '0.08em', fontWeight: 700, transition: 'all 0.2s',
                                        background: tab === t ? '#00d9ff' : 'transparent',
                                        color: tab === t ? '#060d16' : '#64748b',
                                    }, children: t }, t))) }), tab === 'infraestructura' ? (_jsxs(_Fragment, { children: [_jsxs(GlowCard, { children: [label('Tamaño del Rack'), _jsx("div", { style: { display: 'flex', gap: 8 }, children: ['12U', '22U', '36U', '42U'].map(s => (_jsx("button", { onClick: () => setRackSize(s), style: {
                                                        padding: '6px 10px', borderRadius: 8, border: '1px solid',
                                                        cursor: 'pointer', fontSize: 11, fontFamily: 'Consolas, monospace', fontWeight: 700,
                                                        background: rackSize === s ? '#00d9ff' : '#0a1018',
                                                        color: rackSize === s ? '#060d16' : '#64748b',
                                                        borderColor: rackSize === s ? '#00d9ff' : '#1e2d42',
                                                    }, children: s }, s))) })] }), _jsxs(GlowCard, { glowColor: "#22c55e", children: [label('Switches Regulares', '#22c55e'), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }, children: [_jsxs("div", { children: [label('24 Puertos'), _jsx(Spinner, { value: cfg.sw24, onChange: set('sw24') })] }), _jsxs("div", { children: [label('48 Puertos'), _jsx(Spinner, { value: cfg.sw48, onChange: set('sw48') })] })] })] }), _jsxs(GlowCard, { glowColor: "#f59e0b", children: [label('Switches PoE', '#f59e0b'), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }, children: [_jsxs("div", { children: [label('24 Puertos'), _jsx(Spinner, { value: cfg.poe24, onChange: set('poe24') })] }), _jsxs("div", { children: [label('48 Puertos'), _jsx(Spinner, { value: cfg.poe48, onChange: set('poe48') })] })] })] }), _jsxs(GlowCard, { glowColor: "#3b82f6", children: [label('Equipos de Red', '#3b82f6'), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }, children: [_jsxs("div", { children: [label('Routers (rack)'), _jsx(Spinner, { value: cfg.routersInfra, onChange: set('routersInfra'), max: 4 })] }), _jsxs("div", { children: [label('Firewalls'), _jsx(Spinner, { value: cfg.firewalls, onChange: set('firewalls'), max: 4 })] })] }), label('Access Points WiFi', '#a855f7'), _jsx(Spinner, { value: cfg.aps, onChange: set('aps') })] })] })) : (_jsx(_Fragment, { children: [
                                    { key: 'pcs', label: 'PCs / Workstations', icon: Monitor, color: '#00d9ff' },
                                    { key: 'servers', label: 'Servidores', icon: Server, color: '#22c55e' },
                                    { key: 'cameras', label: 'Cámaras IP', icon: Cctv, color: '#f59e0b' },
                                    { key: 'ptz', label: 'Cámaras PTZ', icon: Cctv, color: '#f59e0b' },
                                    { key: 'phones', label: 'Teléfonos VoIP', icon: Phone, color: '#a855f7' },
                                    { key: 'printers', label: 'Impresoras', icon: Printer, color: '#ef4444' },
                                    { key: 'nas', label: 'Almacenamiento NAS', icon: HardDrive, color: '#22c55e' },
                                    { key: 'accesspoints', label: 'Access Points', icon: Wifi, color: '#a855f7' },
                                    { key: 'ptp', label: 'Antenas PTP', icon: Radio, color: '#3b82f6' },
                                    { key: 'ptmp', label: 'Antenas PTMP', icon: Radio, color: '#3b82f6' },
                                    { key: 'routersTopo', label: 'Routers (topología)', icon: Router, color: '#22c55e' },
                                ].map(({ key, label: lbl, icon: Icon, color }) => (_jsx(GlowCard, { glowColor: color, children: _jsx(InputField, { label: lbl, value: cfg[key], onChange: set(key), icon: Icon }) }, key))) }))] }), _jsxs("main", { style: { overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16, background: 'url(/image/GIF.gif)' }, children: [_jsxs(GlowCard, { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }, children: [_jsx(Activity, { size: 16, color: "#00d9ff" }), _jsx("span", { style: { fontSize: 13, fontWeight: 'bold' }, children: "An\u00E1lisis de Capacidad" })] }), _jsxs("div", { style: { marginBottom: 20 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 6 }, children: [_jsx("span", { children: "Utilizaci\u00F3n de Puertos" }), _jsxs("span", { style: { fontFamily: 'Consolas, monospace', color: 'white' }, children: [usedPorts, " / ", totalPorts, " (", utilPct, "%)"] })] }), _jsx("div", { style: { height: 8, background: '#0a1018', borderRadius: 4, overflow: 'hidden', border: '1px solid #1e2d42' }, children: _jsx("div", { style: {
                                                        height: '100%', borderRadius: 4, transition: 'width 0.5s',
                                                        width: `${Math.min(utilPct, 100)}%`,
                                                        background: utilPct > 80
                                                            ? 'linear-gradient(90deg, #ef4444, #f97316)'
                                                            : 'linear-gradient(90deg, #00d9ff, #22c55e)',
                                                    } }) }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#334155', marginTop: 4 }, children: [_jsx("span", { children: "0%" }), _jsx("span", { children: "50%" }), _jsx("span", { children: "100%" })] })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }, children: [
                                            { lbl: 'HOSTS ACTUALES', val: totalHosts, unit: '', color: '#00d9ff' },
                                            { lbl: 'PROYECTADOS', val: projected, unit: '', color: '#a855f7' },
                                            { lbl: 'PUERTOS PoE', val: `${poeDevices}/${poePorts}`, unit: '', color: '#f59e0b' },
                                            { lbl: 'CONSUMO PoE', val: poeWatts, unit: 'W', color: '#f59e0b' },
                                            { lbl: 'IPS DISPONIBLES', val: ipsAvail, unit: '', color: '#22c55e' },
                                            { lbl: 'UNIDADES RACK', val: `${usedRackU}/${rackU}`, unit: 'U', color: '#a855f7' },
                                        ].map(({ lbl, val, unit, color }) => (_jsxs("div", { style: {
                                                padding: '10px 12px', borderRadius: 10,
                                                background: `${color}10`, border: `1px solid ${color}25`,
                                            }, children: [_jsx("div", { style: { fontSize: 9, color, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }, children: lbl }), _jsxs("div", { style: { fontSize: 22, fontWeight: 'bold', fontFamily: 'Consolas, monospace', color }, children: [val, _jsx("span", { style: { fontSize: 12, opacity: 0.6, marginLeft: 3 }, children: unit })] })] }, lbl))) })] }), _jsxs(GlowCard, { glowColor: "#22c55e", children: [label('Topología de Red'), _jsx(NetworkTopology, { pcs: cfg.pcs, servers: cfg.servers, cameras: cfg.cameras, phones: cfg.phones, printers: cfg.printers, switches: switchCount, nas: cfg.nas, cameraptz: cfg.ptz, accessPoints: cfg.accesspoints, antenasptp: cfg.ptp, antenasptmp: cfg.ptmp, routersTopo: cfg.routersTopo })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }, children: [_jsx(GlowCard, { glowColor: "#22c55e", children: _jsx(CostEstimator, { pcs: cfg.pcs, servers: cfg.servers, cameras: cfg.cameras, phones: cfg.phones, cameraptz: cfg.ptz, printers: cfg.printers, nas: cfg.nas, accessPoints: cfg.accesspoints, antenasptp: cfg.ptp, antenasptmp: cfg.ptmp, routersTopo: cfg.routersTopo, switches24: cfg.sw24, switches48: cfg.sw48, poeSwitches24: cfg.poe24, poeSwitches48: cfg.poe48, rackSize: rackSize, routerCore: cfg.routersInfra, firewalls: cfg.firewalls, aps: cfg.aps }) }), _jsx(GlowCard, { glowColor: "#a855f7", children: _jsx(RecommendationCard, { recommendations: recommendations }) })] })] }), _jsxs("aside", { style: {
                            borderLeft: '1px solid #1e2d42', overflowY: 'auto',
                            background: 'url(/image/rack1.png)', padding: 20
                        }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx(Box, { size: 16, color: "cyan" }), _jsxs("span", { style: { fontSize: 13, fontWeight: 'bold', color: '#B0C4DE' }, children: ["Rack ", rackSize] })] }), _jsxs("span", { style: { fontSize: 12, color: 'cyan', fontFamily: 'Consolas, monospace', fontWeight: 'bold' }, children: [usedRackU, "U / ", rackU] })] }), _jsx(RackVisualization, { items: rackItems, totalUnits: rackU })] })] })] }));
}
