'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/profile');
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
                router.push('/login');
            }
        };

        fetchProfile();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (!user) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Command Center 🚀</h1>
                    <p className="text-gray-400 mt-1">Welcome back, <span className="text-indigo-400 font-semibold">{user.username || user.email}</span></p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-red-200 bg-red-900/30 border border-red-500/30 rounded-lg hover:bg-red-900/50 transition-colors"
                >
                    Disconnect Signal
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Active Audience</p>
                            <h3 className="text-2xl font-bold text-white">24.5k</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Engagement Rate</p>
                            <h3 className="text-2xl font-bold text-white">+12.8%</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-pink-500/20 rounded-lg text-pink-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Scheduled Posts</p>
                            <h3 className="text-2xl font-bold text-white">8</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="mt-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Live Activity Feed</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <p className="text-gray-300">New post published to <span className="text-white font-medium">Instagram</span></p>
                        </div>
                        <span className="text-xs text-gray-500">2 mins ago</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <p className="text-gray-300">Account connected: <span className="text-white font-medium">Facebook Page</span></p>
                        </div>
                        <span className="text-xs text-gray-500">1 hour ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
