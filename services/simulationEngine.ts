
import { Packet } from '../types';

const PROTOCOLS = ['TCP', 'UDP', 'HTTP', 'TLSv1.3', 'DNS', 'ARP', 'ICMP'];
const SOURCES = ['192.168.1.15', '192.168.1.1', '10.0.0.5', '172.16.0.22', '45.33.22.11'];
const DESTINATIONS = ['8.8.8.8', '192.168.1.44', '10.0.0.1', '104.21.55.2', '192.168.1.15'];

export const simulationEngine = {
    generatePacket(id: number, timeOffset: number): Packet {
        const protocol = PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)];
        const src = SOURCES[Math.floor(Math.random() * SOURCES.length)];
        const dst = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
        
        let info = '';
        if (protocol === 'HTTP') info = `GET /api/v1/data?id=${Math.floor(Math.random() * 999)} HTTP/1.1`;
        else if (protocol === 'DNS') info = `Standard query 0x${Math.floor(Math.random() * 1000).toString(16)} A google.com`;
        else if (protocol === 'TCP') info = `${Math.floor(Math.random() * 65535)} > 443 [ACK] Seq=${Math.floor(Math.random() * 1000)} Win=502`;
        else info = 'Application Data';

        return {
            id,
            time: (timeOffset + Math.random()).toFixed(6),
            source: src,
            destination: dst,
            protocol,
            length: Math.floor(Math.random() * 1500) + 64,
            info,
            hex: '00 00 00 00 ... [Generated Stream]'
        };
    },

    generateBurst(startId: number, count: number, timeStart: number): Packet[] {
        return Array.from({ length: count }, (_, i) => this.generatePacket(startId + i, timeStart + (i * 0.05)));
    }
};
