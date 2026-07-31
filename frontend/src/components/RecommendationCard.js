import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const styles = {
    info: { color: '#00d9ff', bg: '#00d9ff15' },
    warning: { color: '#f59e0b', bg: '#f59e0b15' },
    tip: { color: '#a855f7', bg: '#a855f715' },
    success: { color: '#22c55e', bg: '#22c55e15' },
};
export default function RecommendationCard({ recommendations }) {
    return (_jsxs("div", { children: [_jsx("p", { style: {
                    margin: '0 0 12px',
                    fontSize: 11,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                }, children: "Recomendaciones" }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 }, children: [recommendations.map((rec, i) => {
                        const s = styles[rec.type];
                        return (_jsxs("div", { style: {
                                background: s.bg,
                                border: `1px solid ${s.color}30`,
                                borderLeft: `3px solid ${s.color}`,
                                borderRadius: 8,
                                padding: '10px 12px',
                                display: 'flex',
                                gap: 10,
                                alignItems: 'flex-start',
                            }, children: [_jsx("span", { style: { fontSize: 14, lineHeight: 1, flexShrink: 0 } }), _jsxs("div", { children: [_jsx("div", { style: {
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                color: s.color,
                                                marginBottom: 3,
                                            }, children: rec.title }), _jsx("div", { style: { fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }, children: rec.description })] })] }, i));
                    }), recommendations.length === 0 && (_jsx("div", { style: { fontSize: 12, color: '#334155', textAlign: 'center', padding: 20 }, children: "Sin recomendaciones" }))] })] }));
}
