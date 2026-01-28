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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-96 p-4">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                            Welcome back, {user.username || user.email}!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            You are logged in as: <span className="font-mono">{user.email}</span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Role: <span className="font-mono">{user.role}</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
