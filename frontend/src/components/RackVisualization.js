import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const colors = {
    router: '#3b82f6',
    firewall: '#ef4444',
    server: '#22c55e',
    switch: '#00d9ff',
    'poe-switch': '#f59e0b',
    'patch-panel': '#64748b',
    ups: '#a855f7',
};
function StatusDot({ status }) {
    const c = status === 'online' ? '#22c55e' : status === 'warning' ? '#f59e0b' : '#ef4444';
    if (!status)
        return null;
    return (_jsx("div", { style: {
            width: 8, height: 7,
            borderRadius: '50%',
            background: c,
            boxShadow: `0 0 6px ${c}`,
            flexShrink: 0,
        } }));
}
function RackUnit({ item }) {
    const c = colors[item.type];
    const height = item.units * 28;
    return (_jsxs("div", { style: {
            height,
            background: `${c}15`,
            border: `1px solid ${c}50`,
            borderLeft: `3px solid ${c}`,
            borderRadius: 4,
            padding: '4px 8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2,
        }, children: [_jsxs("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 6,
                }, children: [_jsx("span", { style: {
                            fontSize: 11,
                            fontWeight: 'bold',
                            color: c,
                            fontFamily: 'Consolas, monospace',
                        }, children: item.label }), _jsx(StatusDot, { status: item.status })] }), item.model && (_jsx("span", { style: { fontSize: 9, color: '#ADD8E6' }, children: item.model })), item.load !== undefined && (_jsx("div", { style: {
                    height: 3,
                    background: '#1e293b',
                    borderRadius: 2,
                    overflow: 'hidden',
                    marginTop: 2,
                }, children: _jsx("div", { style: {
                        height: '100%',
                        width: `${item.load}%`,
                        background: item.load > 80 ? '#bb1414' : '#22c55e',
                        borderRadius: 2,
                        transition: 'width 0.5s',
                    } }) }))] }));
}
export default function RackVisualization({ items, totalUnits }) {
    let occupied = 0;
    let overflow = false;
    const visibleItems = [];
    for (const item of items) {
        if (occupied + item.units > totalUnits) {
            overflow = true;
            break;
        }
        visibleItems.push(item);
        occupied += item.units;
    }
    const usedUnits = occupied;
    const freeUnits = totalUnits - usedUnits;
    return (_jsxs("div", { children: [_jsxs("div", { style: {
                    background: 'rgba(119, 136, 153, 0.4)',
                    border: '1px solid rgba(119, 136, 153, 0.6)',
                    borderRadius: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                    color: '#778899',
                    marginBottom: 20,
                    fontFamily: 'Consolas, monospace',
                    fontWeight: 'bold',
                }, children: [_jsxs("span", { children: [usedUnits, "U usadas"] }), _jsxs("span", { children: [freeUnits, "U libres"] })] }), overflow && (_jsxs("div", { style: {
                    marginBottom: 12,
                    padding: '10px',
                    borderRadius: 8,
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '2px solid rgba(239, 68, 68, 0.4)',
                    color: '#ef4444',
                    fontSize: 11,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: 'Consolas, monospace',
                }, children: ["\u26A0 Rack LLeno: ", _jsx("br", {}), "No hay suficiente espacio."] })), _jsx("hr", { style: { borderColor: '#B0C4DE', borderWidth: 3 } }), _jsx("br", {}), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 30 }, children: [visibleItems.map((item, i) => (_jsx(RackUnit, { item: item }, i))), freeUnits > 0 && (_jsxs("div", { style: {
                            height: freeUnits * 28,
                            border: '1px dashed #1e293b',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            color: '#ADD8E6',
                            fontFamily: 'Consolas, monospace',
                        }, children: [freeUnits, "U disponibles"] }))] })] }));
}
