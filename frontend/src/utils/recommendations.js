export function generateRecommendations(cfg, metrics) {
    const recs = [];
    // 1. Puertos insuficientes
    if (metrics.totalPorts > 0 && metrics.usedPorts > metrics.totalPorts * 0.85) {
        recs.push({
            type: 'warning',
            title: 'Puertos de switch insuficientes',
            description: `Se están usando ${metrics.usedPorts} de ${metrics.totalPorts} puertos. Considera agregar más switches (24 o 48 puertos) para ampliar la capacidad.`,
        });
    }
    // 2. Switches PoE insuficientes
    const poeCapacity = cfg.poe24 * 370 + cfg.poe48 * 740;
    if (metrics.poeDevices > 0 && metrics.poePorts < metrics.poeDevices) {
        recs.push({
            type: 'warning',
            title: 'Puertos PoE insuficientes',
            description: `Tienes ${metrics.poeDevices} dispositivos PoE pero solo ${metrics.poePorts} puertos PoE disponibles. Agrega switches PoE o inyectores PoE.`,
        });
    }
    if (metrics.poeWatts > poeCapacity * 0.8 && poeCapacity > 0) {
        recs.push({
            type: 'warning',
            title: 'Consumo PoE elevado',
            description: `El consumo estimado es de ${metrics.poeWatts}W, cerca del límite de los switches PoE actuales. Considera switches de mayor capacidad.`,
        });
    }
    // 3. NVR para cámaras IP
    if (cfg.cameras > 0 && cfg.nas === 0) {
        recs.push({
            type: 'tip',
            title: 'NVR para cámaras IP',
            description: `Con ${cfg.cameras} cámaras IP, un NVR dedicado facilitará la gestión y grabación centralizada.`,
        });
    }
    // 4. Almacenamiento NAS
    if (cfg.servers >= 2 && cfg.nas === 0) {
        recs.push({
            type: 'info',
            title: 'Almacenamiento NAS recomendado',
            description: 'Varios servidores se benefician de un NAS para backups y almacenamiento compartido.',
        });
    }
    // 5. Controlador WiFi
    if (cfg.aps > 0) {
        recs.push({
            type: 'info',
            title: 'Controlador inalámbrico',
            description: 'Para gestionar múltiples Access Points, considera un controlador WiFi centralizado.',
        });
    }
    // 6. Patch panels y cableado
    if (metrics.usedPorts > 24) {
        recs.push({
            type: 'tip',
            title: 'Patch panels para organización',
            description: 'Con muchos dispositivos, los patch panels mejoran la gestión del cableado y facilitan cambios.',
        });
    }
    // 7. Rack lleno
    if (metrics.rackU > 0 && metrics.usedRackU / metrics.rackU > 0.85) {
        recs.push({
            type: 'warning',
            title: 'Espacio en rack limitado',
            description: `Has usado ${metrics.usedRackU}U de ${metrics.rackU}U. Considera un rack adicional o reorganizar la distribución.`,
        });
    }
    // 8. Ventilación
    if (metrics.rackU > 0 && metrics.usedRackU / metrics.rackU > 0.7) {
        recs.push({
            type: 'tip',
            title: 'Ventilación adicional',
            description: 'Con alta densidad de equipos, instala paneles de ventilación o ventiladores para evitar sobrecalentamiento.',
        });
    }
    // 9. Capacidad UPS mejorada
    const upsCapacity = 3000;
    if (metrics.totalWatts > upsCapacity * 0.8) {
        recs.push({
            type: 'warning',
            title: 'Capacidad UPS insuficiente',
            description: `El consumo estimado es de ${metrics.totalWatts}W, supera el 80% de la capacidad actual. Considera una UPS de mayor capacidad.`,
        });
    }
    // 10. PDU redundante
    if (cfg.servers > 0 || metrics.switchCount > 0) {
        recs.push({
            type: 'info',
            title: 'PDU redundante',
            description: 'Para equipos críticos, una PDU con doble alimentación mejora la disponibilidad.',
        });
    }
    // 11. Transceptores SFP para enlaces de fibra (usando routersInfra)
    if (cfg.sw24 + cfg.sw48 + cfg.poe24 + cfg.poe48 + cfg.routersInfra > 0) {
        recs.push({
            type: 'info',
            title: 'Transceptores SFP para enlaces de fibra',
            description: 'Si necesitas conexiones de larga distancia, considera transceptores SFP/SFP+ y módulos de fibra óptica.',
        });
    }
    // 12. Antenas PTP/PTMP - estructura de montaje
    if (cfg.ptp > 0 || cfg.ptmp > 0) {
        recs.push({
            type: 'tip',
            title: 'Soportes para antenas exteriores',
            description: 'Para antenas PTP/PTMP, asegúrate de contar con soportes de montaje y cableado exterior adecuado.',
        });
    }
    // 13. Organizadores de cable
    if (metrics.totalHosts > 10) {
        recs.push({
            type: 'tip',
            title: 'Organizadores de cable',
            description: 'Con más de 10 dispositivos, los organizadores verticales/horizontales ayudan a mantener el orden y la ventilación.',
        });
    }
    // Si no hay recomendaciones
    if (recs.length === 0) {
        recs.push({
            type: 'success',
            title: 'Configuración equilibrada',
            description: 'Tu infraestructura parece estar bien dimensionada. ¡Sigue así!',
        });
    }
    return recs;
}
