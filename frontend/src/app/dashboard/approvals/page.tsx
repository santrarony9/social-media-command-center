'use client';

import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { format } from 'date-fns';

interface Post {
    id: string;
    content: string;
    status: string;
    scheduledAt: string;
    client: { name: string };
    creator: { name: string };
    createdAt: string;
}

export default function ApprovalsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingPosts();
    }, []);

    const fetchPendingPosts = async () => {
        try {
            const res = await api.get('/posts?status=PENDING_APPROVAL');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await api.patch(`/posts/${id}/approve`);
            setPosts(posts.filter(p => p.id !== id));
            alert('Post Approved! 🚀');
        } catch (err) {
            alert('Failed to approve post');
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Reason for rejection:');
        if (!reason) return;
        try {
            await api.patch(`/posts/${id}/reject`, { reason });
            setPosts(posts.filter(p => p.id !== id));
            alert('Post Rejected ❌');
        } catch (err) {
            alert('Failed to reject post');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Approvals Queue 🚦</h1>
            <p className="text-gray-400">Review content before it goes live.</p>

            {loading ? (
                <p className="text-gray-400">Loading pending posts...</p>
            ) : posts.length === 0 ? (
                <div className="bg-white/5 border border-white/10 p-8 rounded-xl text-center">
                    <h3 className="text-xl font-bold text-white">All Clear! 🎉</h3>
                    <p className="text-gray-400 mt-2">No pending posts to review.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2 py-1 rounded border border-indigo-500/30">
                                        {post.client.name}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                        by {post.creator.name} • {format(new Date(post.createdAt), 'MMM d, h:mm a')}
                                    </span>
                                </div>
                                <p className="text-white text-lg whitespace-pre-wrap">{post.content}</p>
                                {post.scheduledAt && (
                                    <p className="text-yellow-400 text-sm">
                                        📅 Scheduled for: {format(new Date(post.scheduledAt), 'MMM d, yyyy h:mm a')}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-row md:flex-col gap-3 justify-center min-w-[150px]">
                                <button
                                    onClick={() => handleApprove(post.id)}
                                    className="bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-500/30 font-bold py-3 px-4 rounded-lg transition"
                                >
                                    ✅ Approve
                                </button>
                                <button
                                    onClick={() => handleReject(post.id)}
                                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 font-bold py-3 px-4 rounded-lg transition"
                                >
                                    ❌ Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
