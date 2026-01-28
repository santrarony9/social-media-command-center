'use client';

import { useState, useEffect } from 'react';
import api from '../../../utils/api';

interface SocialAccount {
    id: string;
    platform: string;
    profileName: string;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form state
    const [platform, setPlatform] = useState('FACEBOOK');
    const [accessToken, setAccessToken] = useState('');
    const [profileName, setProfileName] = useState('');

    // Fetch accounts on load
    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/social-accounts');
            setAccounts(res.data);
        } catch (err) {
            console.error('Failed to fetch accounts', err);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Hardcoded Client ID for MVP (In real app, user selects client)
        // We haven't built Client selection in frontend yet, so we might need a workaround.
        // Ideally, we fetch clients first. But to keep it simple, let's assume we create a client or use one.
        // WAIT: The backend requires a clientId. We need to create a client first!
        // Let's quickly fetch clients, and if none exist, create a default one behind the scenes?
        // Or simpler: Let the user just type a Client ID for now? No, that's bad UX.
        // Better: Auto-create a "Personal" client if none exists.

        try {
            // 1. Get Clients
            const clientsRes = await api.get('/clients');
            let targetClientId = '';

            if (clientsRes.data.length > 0) {
                targetClientId = clientsRes.data[0].id;
            } else {
                // Create a default client
                const newClient = await api.post('/clients', { name: 'My Personal Brand' });
                targetClientId = newClient.data.id;
            }

            // 2. Create Account
            await api.post('/social-accounts', {
                platform,
                platformId: '123456789', // Dummy ID
                accessToken,
                profileName,
                clientId: targetClientId,
            });

            // 3. Refresh list
            setAccessToken('');
            setProfileName('');
            fetchAccounts();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to connect account');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold dark:text-white">Connected Accounts 🌐</h1>

            {/* Connection Form */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Connect New Account</h2>
                <form onSubmit={handleConnect} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                        >
                            <option value="FACEBOOK">Facebook</option>
                            <option value="INSTAGRAM">Instagram</option>
                            <option value="TWITTER">X (Twitter)</option>
                            <option value="YOUTUBE">YouTube</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Profile Name (e.g. My Page)"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Access Token (Paste it here)"
                            value={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                            className="p-2 border rounded dark:bg-gray-700 dark:text-white col-span-2"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Connect Account
                    </button>
                </form>
            </div>

            {/* List of Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    <p>Loading...</p>
                ) : accounts.length === 0 ? (
                    <p className="dark:text-gray-400">No accounts connected yet.</p>
                ) : (
                    accounts.map((acc) => (
                        <div key={acc.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-indigo-500">
                            <h3 className="font-bold text-lg dark:text-white">{acc.platform}</h3>
                            <p className="text-gray-600 dark:text-gray-300">@{acc.profileName}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
