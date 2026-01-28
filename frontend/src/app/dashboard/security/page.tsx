'use client';

import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { format } from 'date-fns';

interface AuditLog {
    id: string;
    action: string;
    resource: string;
    ipAddress: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
        role: string;
    }
    details: any;
}

export default function SecurityPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await api.get('/audit?limit=50');
            setLogs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Security Command 🛡️</h1>
                    <p className="text-gray-400">System surveillance and audit trails.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded text-xs flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        System Secure
                    </div>
                    <button onClick={fetchLogs} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-sm transition">
                        Refresh Logs
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1a1a2e] border border-white/10 p-4 rounded-xl">
                    <h3 className="text-gray-400 text-sm">Active Sessions</h3>
                    <p className="text-2xl font-bold text-white mt-1">12</p>
                </div>
                <div className="bg-[#1a1a2e] border border-white/10 p-4 rounded-xl">
                    <h3 className="text-gray-400 text-sm">Failed Login Attempts</h3>
                    <p className="text-2xl font-bold text-red-400 mt-1">0</p>
                </div>
                <div className="bg-[#1a1a2e] border border-white/10 p-4 rounded-xl">
                    <h3 className="text-gray-400 text-sm">Security Events (24h)</h3>
                    <p className="text-2xl font-bold text-indigo-400 mt-1">{logs.length}</p>
                </div>
            </div>

            <div className="bg-[#0f0f1a] border border-white/10 rounded-xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-white/10 bg-white/5">
                    <h3 className="font-bold text-white">Live Audit Stream</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-semibold text-gray-300">
                            <tr>
                                <th className="p-4">Timestamp</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Action</th>
                                <th className="p-4">Resource</th>
                                <th className="p-4">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-white/5 transition">
                                    <td className="p-4 font-mono text-xs text-gray-500">
                                        {format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                                {log.user.name.charAt(0)}
                                            </div>
                                            <span className="text-white">{log.user.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold 
                                    ${log.action.includes('DELETE') ? 'bg-red-500/20 text-red-300' :
                                                log.action.includes('POST') ? 'bg-blue-500/20 text-blue-300' :
                                                    log.action.includes('LOGIN') ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-xs">{log.resource || '-'}</td>
                                    <td className="p-4 font-mono text-xs text-indigo-300">{log.ipAddress || 'Unknown'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
