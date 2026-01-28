'use client';

import { useState, useEffect } from 'react';
import api from '../../../utils/api';

interface Post {
    id: string;
    content: string;
    mediaUrls: string[];
    mediaType: string;
    platforms: string[];
    status: string;
    scheduledAt: string | null;
    client: { name: string };
    createdAt: string;
}

interface Client {
    id: string;
    name: string;
}

const PLATFORMS = [
    { id: 'FACEBOOK', icon: '📘', label: 'Facebook' },
    { id: 'INSTAGRAM', icon: '📸', label: 'Instagram' },
    { id: 'TWITTER', icon: '🐦', label: 'X (Twitter)' },
    { id: 'LINKEDIN', icon: '💼', label: 'LinkedIn' },
    { id: 'YOUTUBE', icon: '▶️', label: 'YouTube' },
];

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [content, setContent] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [mediaType, setMediaType] = useState('TEXT'); // TEXT, IMAGE, VIDEO
    const [mediaUrl, setMediaUrl] = useState('');

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

    const togglePlatform = (id: string) => {
        if (selectedPlatforms.includes(id)) {
            setSelectedPlatforms(selectedPlatforms.filter(p => p !== id));
        } else {
            setSelectedPlatforms([...selectedPlatforms, id]);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClientId) return alert('Select a client first');
        if (selectedPlatforms.length === 0) return alert('Select at least one platform');

        try {
            await api.post('/posts', {
                content,
                clientId: selectedClientId,
                mediaUrls: mediaUrl ? [mediaUrl] : [],
                mediaType,
                platforms: selectedPlatforms,
                scheduledAt: scheduledAt || undefined,
            });

            // Reset
            setContent('');
            setMediaUrl('');
            setMediaType('TEXT');
            setSelectedPlatforms([]);
            setIsCreating(false);
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create post');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/posts/${id}`);
            setPosts(posts.filter(p => p.id !== id));
        } catch (err) { alert('Failed delete'); }
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

            {/* CREATE POST COMPOSER */}
            {isCreating && (
                <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-top-4">
                    {/* Left: Input Form */}
                    <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
                        <h2 className="text-xl font-bold dark:text-white mb-4">Composer</h2>

                        {/* 1. Client Select */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Brand Identity</label>
                            <select
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-white"
                            >
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        {/* 2. Platform Select */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Target Platforms</label>
                            <div className="flex gap-2 flex-wrap">
                                {PLATFORMS.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => togglePlatform(p.id)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded border transition ${selectedPlatforms.includes(p.id)
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        <span>{p.icon}</span>
                                        <span className="text-sm font-medium">{p.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Media Type */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Content Format</label>
                            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg inline-flex">
                                {['TEXT', 'IMAGE', 'VIDEO'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setMediaType(type)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${mediaType === type
                                            ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-white'
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 4. Content Input */}
                        <div className="relative">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg h-40 resize-none text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Write your masterpiece..."
                            />
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!content || content.length < 5) return alert('Write more first!');
                                    try {
                                        const res = await api.post('/seo/optimize', { content, industry: 'General' });
                                        setContent(res.data.optimizedContent);
                                    } catch (e) { alert('AI Failed'); }
                                }}
                                className="absolute bottom-3 right-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-3 py-1 rounded-full shadow hover:shadow-cyan-500/50 flex items-center gap-1"
                            >
                                ✨ AI Enhance
                            </button>
                        </div>

                        {/* 5. File Upload (Base64) */}
                        {mediaType !== 'TEXT' && (
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    Upload {mediaType === 'IMAGE' ? 'Image' : 'Video'} (Max 1.5MB)
                                </label>

                                {/* Drag & Drop Area */}
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition relative">
                                    <input
                                        type="file"
                                        accept={mediaType === 'IMAGE' ? "image/*" : "video/*"}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            // 1.5MB Limit for Vercel Serverless
                                            if (file.size > 1.5 * 1024 * 1024) {
                                                alert("File too large! Must be under 1.5MB for the free plan.");
                                                e.target.value = ''; // Reset
                                                return;
                                            }

                                            // Convert to Base64
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setMediaUrl(reader.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="text-gray-500 dark:text-gray-400">
                                        {mediaUrl ? (
                                            <span className="text-green-600 font-bold">✅ File Selected</span>
                                        ) : (
                                            <>
                                                <span className="text-2xl block mb-2">📂</span>
                                                <span className="text-sm">Click or Drag file here</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {mediaUrl && (
                                    <button
                                        onClick={() => setMediaUrl('')}
                                        className="text-xs text-red-500 hover:text-red-700 underline"
                                    >
                                        Remove File
                                    </button>
                                )}
                            </div>
                        )}

                        {/* 6. Schedule & Action */}
                        <div className="flex gap-4 items-end pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Schedule (Optional)</label>
                                <input
                                    type="datetime-local"
                                    value={scheduledAt}
                                    onChange={(e) => setScheduledAt(e.target.value)}
                                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-white"
                                />
                            </div>
                            <button
                                onClick={handleCreatePost}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded shadow-lg shadow-indigo-500/30 transition transform hover:scale-[1.02]"
                            >
                                🚀 Launch Post
                            </button>
                        </div>
                    </div>

                    {/* Right: Preview Card */}
                    <div className="w-full lg:w-96">
                        <h2 className="text-xl font-bold dark:text-white mb-4">Preview</h2>

                        {/* Mock Phone Preview */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[2rem] overflow-hidden shadow-2xl max-w-sm mx-auto p-4 min-h-[500px] relative">
                            {/* Status Bar Mock */}
                            <div className="flex justify-between text-xs text-gray-400 mb-4 px-2">
                                <span>9:41</span>
                                <span>📶 🔋</span>
                            </div>

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                    B
                                </div>
                                <div>
                                    <div className="font-bold text-sm dark:text-white">Brand Name</div>
                                    <div className="text-xs text-gray-500">Sponsored • 🌍</div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                    {content || "Your caption goes here..."}
                                </p>

                                {/* Media Preview */}
                                {mediaType === 'IMAGE' && (
                                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                                        {mediaUrl ? (
                                            <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400">Image Preview</span>
                                        )}
                                    </div>
                                )}
                                {mediaType === 'VIDEO' && (
                                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-gray-500">
                                        ▶️ Video
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="flex gap-4 mt-4 text-xl text-gray-400">
                                <span>❤️</span> <span>💬</span> <span>✈️</span>
                            </div>

                            {/* Platforms Tags */}
                            <div className="absolute bottom-4 left-4 right-4 flex gap-1 flex-wrap">
                                {selectedPlatforms.map(p => (
                                    <span key={p} className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Existing Posts List Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {posts.map(post => (
                    <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-500/30 transition group">
                        {/* Media Thumbnail */}
                        <div className="bg-gray-100 dark:bg-gray-900 h-48 flex items-center justify-center overflow-hidden relative">
                            {post.mediaType === 'IMAGE' && post.mediaUrls[0] ? (
                                <img src={post.mediaUrls[0]} alt="Post" className="w-full h-full object-cover" />
                            ) : post.mediaType === 'VIDEO' ? (
                                <div className="text-4xl">▶️</div>
                            ) : (
                                <div className="text-4xl text-gray-300">📝</div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1">
                                {post.platforms?.map((p: any) => (
                                    <span key={p} className="text-[10px] bg-black/50 backdrop-blur text-white px-2 py-1 rounded">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2 py-1 text-xs rounded font-bold ${post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {post.status}
                                </span>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="text-gray-400 hover:text-red-500 transition"
                                >
                                    🗑️
                                </button>
                            </div>

                            <p className="text-gray-800 dark:text-gray-200 text-sm line-clamp-3 mb-4">
                                {post.content}
                            </p>

                            <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-3">
                                <span>{post.client.name}</span>
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
