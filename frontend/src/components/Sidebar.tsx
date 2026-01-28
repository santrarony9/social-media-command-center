'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Accounts', href: '/dashboard/accounts' },
        { name: 'Posts', href: '/dashboard/posts' },
        { name: 'Clients', href: '/dashboard/clients' },
        { name: 'Team', href: '/dashboard/team' },
        { name: 'Approvals', href: '/dashboard/approvals' },
    ];

    return (
        <div className="flex min-h-screen flex-col w-64 bg-[#050505] border-r border-white/5 text-white">
            <div className="flex h-16 items-center justify-center border-b border-white/5 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
                <h1 className="text-xl font-bold tracking-tight">DP <span className="text-indigo-500">Connect</span></h1>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-gray-800 p-4">
                <div className="text-xs text-gray-500">
                    Logged in as User
                </div>
            </div>
        </div>
    );
}
