'use client';

import { useState, useEffect } from 'react';
import api from '../../../utils/api';

interface Post {
    id: string;
    content: string;
    status: string;
    scheduledAt: string | null;
    client: { name: string };
    createdAt: string;
}

interface Client {
    id: string;
    name: string;
}

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [content, setContent] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [selectedClientId, setSelectedClientId] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [postsRes, clientsRes] = await Promise.all([
                api.get('/posts'),
                api.get('/clients')
            ]);
            setPosts(postsRes.data);
            setClients(clientsRes.data);
            if (clientsRes.data.length > 0) {
                setSelectedClientId(clientsRes.data[0].id);
            }
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClientId) return alert('Please create a Client first / Connect an account');

        try {
            await api.post('/posts', {
                content,
                clientId: selectedClientId,
                scheduledAt: scheduledAt || undefined,
            });

            // Reset and refresh
            setContent('');
            setScheduledAt('');
            setIsCreating(false);
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create post');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold dark:text-white">Content Control 📢</h1>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    {isCreating ? 'Cancel' : '+ New Post'}
                </button>
            </div>

            {/* Create Post Form */}
            {isCreating && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Draft New Content</h2>
                    <form onSubmit={handleCreatePost} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Client / Brand</label>
                            <select
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            >
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Post Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded h-32 dark:bg-gray-700 dark:text-white"
                                placeholder="What's on your mind?..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Schedule (Optional)</label>
                            <input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded font-bold hover:bg-indigo-700">
                            🚀 Launch Post
                        </button>
                    </form>
                </div>
            )}

            {/* Posts List */}
            <div className="grid gap-4">
                {loading ? (
                    <p>Loading content...</p>
                ) : posts.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        <p className="text-xl">No posts yet.</p>
                        <p>Create your first post to start the magic!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-purple-500 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 text-xs rounded font-bold ${post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {post.status}
                                    </span>
                                    <span className="text-sm text-gray-500">{post.client.name}</span>
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{post.content}</p>
                                {post.scheduledAt && (
                                    <p className="text-xs text-indigo-400 mt-2">🕒 Scheduled for: {new Date(post.scheduledAt).toLocaleString()}</p>
                                )}
                            </div>
                            <div className="text-sm text-gray-400">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
