'use client';

import { useState, useEffect } from 'react';
import api from '../../../utils/api';

interface Client {
    id: string;
    name: string;
    industry: string | null;
    createdAt: string;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients');
            setClients(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/clients', { name, industry: 'Brand' });
            setName('');
            setIsCreating(false);
            fetchClients();
        } catch (err) {
            alert('Failed to create client');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Clients & Brands 💼</h1>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    {isCreating ? 'Cancel' : '+ Add Client'}
                </button>
            </div>

            <p className="text-gray-400">
                These are the brands you manage. Linking a social account automatically creates a client for you if none exists.
            </p>

            {isCreating && (
                <div className="bg-white/5 border border-white/10 p-6 rounded-lg shadow animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleCreate} className="flex gap-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Client Name (e.g. My Shoe Brand)"
                            className="flex-1 p-2 rounded bg-black/50 border border-white/20 text-white"
                            required
                        />
                        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded">Save</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : clients.length === 0 ? (
                    <p className="text-gray-500">No clients found.</p>
                ) : (
                    clients.map((client) => (
                        <div key={client.id} className="bg-white/5 border border-white/10 p-6 rounded-lg hover:border-indigo-500/50 transition">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                    {client.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{client.name}</h3>
                                    <p className="text-xs text-gray-400">ID: {client.id.slice(0, 8)}...</p>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <span className="text-xs bg-white/10 text-white px-2 py-1 rounded">Industry: {client.industry || 'General'}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
