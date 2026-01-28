'use client';

import { useState, useEffect } from 'react';
import api from '../../../utils/api';

interface SocialAccount {
    id: string;
    platform: string;
    profileName: string;
    client: { name: string };
}

interface Client {
    id: string;
    name: string;
}

const PLATFORMS = [
    { id: 'FACEBOOK', name: 'Facebook', color: 'bg-blue-600', icon: '📘' },
    { id: 'INSTAGRAM', name: 'Instagram', color: 'bg-pink-600', icon: '📸' },
    { id: 'TWITTER', name: 'X (Twitter)', color: 'bg-black', icon: '🐦' },
    { id: 'LINKEDIN', name: 'LinkedIn', color: 'bg-blue-700', icon: '💼' },
    { id: 'YOUTUBE', name: 'YouTube', color: 'bg-red-600', icon: '▶️' },
];

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    // Wizard State
    const [step, setStep] = useState(1); // 1: Client, 2: Platform, 3: Credentials
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('');

    // Form Inputs
    const [accessToken, setAccessToken] = useState('');
    const [profileName, setProfileName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [accRes, cliRes] = await Promise.all([
                api.get('/social-accounts'),
                api.get('/clients')
            ]);
            setAccounts(accRes.data);
            setClients(cliRes.data);
            if (cliRes.data.length > 0) setSelectedClientId(cliRes.data[0].id);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/social-accounts', {
                platform: selectedPlatform,
                platformId: '123_placeholder',
                accessToken,
                profileName,
                clientId: selectedClientId,
            });
            // Reset Wizard
            setStep(1);
            setAccessToken('');
            setProfileName('');
            fetchData();
            alert('Connected successfully! 🚀');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to connect');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Disconnect this account?')) return;
        try {
            await api.delete(`/social-accounts/${id}`);
            setAccounts(accounts.filter(a => a.id !== id));
        } catch (e) { alert('Failed to disconnect'); }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold dark:text-white">Connections Manager 🔌</h1>

            {/* CONNECTION WIZARD */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 border border-gray-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <h2 className="text-2xl font-bold">Connect New Asset</h2>
                    <p className="opacity-80">Link your social media to a client brand in 3 simple steps.</p>
                </div>

                <div className="p-8">
                    {/* Stepper Header */}
                    <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
                        <div className={`flex flex-col items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 1 ? 'bg-indigo-100' : 'bg-gray-100'}`}>1</div>
                            <span className="text-xs font-bold uppercase">Select Brand</span>
                        </div>
                        <div className="h-0.5 w-full bg-gray-200 mx-4"></div>
                        <div className={`flex flex-col items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 2 ? 'bg-indigo-100' : 'bg-gray-100'}`}>2</div>
                            <span className="text-xs font-bold uppercase">Choose Platform</span>
                        </div>
                        <div className="h-0.5 w-full bg-gray-200 mx-4"></div>
                        <div className={`flex flex-col items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 3 ? 'bg-indigo-100' : 'bg-gray-100'}`}>3</div>
                            <span className="text-xs font-bold uppercase">Authenticate</span>
                        </div>
                    </div>

                    {/* Step 1: Select Client */}
                    {step === 1 && (
                        <div className="max-w-md mx-auto space-y-4">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Which Client is this for?</label>
                            <select
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-lg dark:text-white"
                            >
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button
                                onClick={() => setStep(2)}
                                className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition"
                            >
                                Continue →
                            </button>
                        </div>
                    )}

                    {/* Step 2: Select Platform */}
                    {step === 2 && (
                        <div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                                {PLATFORMS.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPlatform(p.id)}
                                        className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition hover:shadow-lg ${selectedPlatform === p.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-transparent bg-gray-50 dark:bg-gray-700'}`}
                                    >
                                        <span className="text-3xl">{p.icon}</span>
                                        <span className="font-bold text-sm dark:text-white">{p.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700 px-4">Back</button>
                                <button
                                    disabled={!selectedPlatform}
                                    onClick={() => setStep(3)}
                                    className="flex-1 bg-indigo-600 disabled:opacity-50 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition"
                                >
                                    Continue to Secure Login →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Authenticate */}
                    {step === 3 && (
                        <div className="max-w-lg mx-auto">
                            <h3 className="text-center font-bold text-xl mb-6 dark:text-white">Connecting to {selectedPlatform}</h3>
                            <form onSubmit={handleConnect} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-1">Profile Name (Internal Label)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Official Page"
                                        value={profileName}
                                        onChange={(e) => setProfileName(e.target.value)}
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-1">Access Token / API Key</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Paste token here..."
                                            value={accessToken}
                                            onChange={(e) => setAccessToken(e.target.value)}
                                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg dark:text-white pr-24"
                                            required
                                        />
                                        <span className="absolute right-3 top-3 text-xs text-indigo-500 font-bold cursor-pointer hover:underline" onClick={() => alert("Simulated: In a real app, you'd get this from the developer portal.")}>
                                            Where is this?
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        ℹ️ For strict agency security, we use manual token entry to prevent unauthorized account scraping.
                                    </p>
                                </div>

                                {error && <p className="text-red-500 text-center">{error}</p>}

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setStep(2)} className="text-gray-500 px-4">Back</button>
                                    <button type="submit" className="flex-1 bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-500/30">
                                        Verify & Connect 🚀
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* CONNECTED ACCOUNTS LIST */}
            <div>
                <h2 className="text-xl font-bold dark:text-white mb-4">Active Connections</h2>
                {loading ? <p>Loading...</p> : accounts.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-400">No accounts linked yet. Start the wizard above!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {accounts.map((acc: any) => (
                            <div key={acc.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center group hover:border-indigo-500/30 transition">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gray-100 dark:bg-gray-700`}>
                                        {PLATFORMS.find(p => p.id === acc.platform)?.icon || '🌐'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold dark:text-white">{acc.profileName}</h3>
                                        <p className="text-xs text-gray-500">{acc.client?.name || 'Unknown Client'}</p>
                                        <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(acc.id)}
                                    className="text-gray-300 hover:text-red-500 transition"
                                >
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
