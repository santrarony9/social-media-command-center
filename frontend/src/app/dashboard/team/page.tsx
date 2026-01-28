'use client';

import { useState, useEffect } from 'react';
import api from '../../../utils/api';

interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    jobTitle: string;
    isActive: boolean;
}

export default function TeamPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [jobTitle, setJobTitle] = useState('');

    // Assignment State
    const [selectedClientId, setSelectedClientId] = useState('');
    const [permissionLevel, setPermissionLevel] = useState('FULL_ACCESS');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [clients, setClients] = useState<any[]>([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/admin/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients');
            setClients(res.data);
        } catch (err) { console.error(err); }
    };

    const handleAssign = async () => {
        if (!selectedEmployee || !selectedClientId) return;
        try {
            await api.post('/admin/assign', {
                userId: selectedEmployee.id,
                clientId: selectedClientId,
                permissionLevel
            });
            setShowAssignModal(false);
            alert(`Access granted to ${selectedEmployee.name}`);
        } catch (err) {
            alert('Failed to assign client');
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/employees', { name, email, password, jobTitle });
            setShowInviteModal(false);
            setName(''); setEmail(''); setPassword(''); setJobTitle('');
            fetchEmployees();
            alert('Employee created successfully'); // Simple feedback for now
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create employee');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Agency Team 👥</h1>
                    <p className="text-gray-400">Manage access for your internal staff.</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
                >
                    + Invite Employee
                </button>
            </div>

            {showInviteModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#0f0f1a] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Invite New Member</h2>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm">Full Name</label>
                                <input
                                    type="text" value={name} onChange={e => setName(e.target.value)}
                                    className="w-full p-2 rounded bg-black/50 border border-white/20 text-white" required
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Job Title</label>
                                <input
                                    type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                                    placeholder="e.g. Content Manager"
                                    className="w-full p-2 rounded bg-black/50 border border-white/20 text-white" required
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Email</label>
                                <input
                                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    className="w-full p-2 rounded bg-black/50 border border-white/20 text-white" required
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Initial Password</label>
                                <input
                                    type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    className="w-full p-2 rounded bg-black/50 border border-white/20 text-white" required
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 p-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="flex-1 bg-indigo-600 text-white p-2 rounded font-bold hover:bg-indigo-500">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Client Modal */}
            {showAssignModal && selectedEmployee && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#0f0f1a] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Assign Client to {selectedEmployee.name}</h2>
                        <p className="text-gray-400 mb-6 text-sm">Select which client this employee can access and their permission level.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm">Select Client</label>
                                <select
                                    className="w-full p-2 rounded bg-black/50 border border-white/20 text-white"
                                    onChange={(e) => setSelectedClientId(e.target.value)}
                                >
                                    <option value="">-- Choose Brand --</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-gray-400 text-sm">Permission Level</label>
                                <select
                                    className="w-full p-2 rounded bg-black/50 border border-white/20 text-white"
                                    onChange={(e) => setPermissionLevel(e.target.value)}
                                >
                                    <option value="FULL_ACCESS">Full Access (Post, Delete, Analytics)</option>
                                    <option value="CONTENT_ONLY">Content Only (Draft, Upload)</option>
                                    <option value="ANALYTICS_ONLY">Analytics Only (View Reports)</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setShowAssignModal(false)} className="flex-1 p-2 text-gray-400 hover:text-white">Cancel</button>
                                <button onClick={handleAssign} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded font-bold hover:shadow-lg hover:shadow-indigo-500/50">Confirm Assignment</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Employee List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map(emp => (
                    <div key={emp.id} className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-indigo-500/30 transition group relative">
                        <div className="flex items-center gap-4 mb-4" >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                                {emp.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{emp.name}</h3>
                                <p className="text-xs text-indigo-400 uppercase tracking-wider">{emp.jobTitle || 'Employee'}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-400">
                            <p className="flex justify-between">
                                <span>Email:</span> <span className="text-white">{emp.email}</span>
                            </p>
                            <p className="flex justify-between">
                                <span>Status:</span>
                                <span className={`px-2 py-0.5 rounded text-xs ${emp.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {emp.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                            <button
                                onClick={() => { setSelectedEmployee(emp); fetchClients(); setShowAssignModal(true); }}
                                className="flex-1 text-xs bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 py-2 rounded border border-indigo-500/30 transition font-semibold"
                            >
                                Assign Client
                            </button>
                            <button className="flex-1 text-xs bg-white/5 hover:bg-red-500/20 py-2 rounded text-gray-300 hover:text-red-400">Disable</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
