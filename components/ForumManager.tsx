'use client';

import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Search,
    Plus,
    ChevronRight,
    ThumbsUp,
    ThumbsDown,
    MessageCircle,
    Eye,
    User,
    Clock,
    Tag as TagIcon,
    Filter,
    CheckCircle2,
    Pin,
    Loader2,
    Send,
    Share2,
    AlertCircle,
    AlertTriangle,
    Flag
} from 'lucide-react';
import {
    listForumCategories,
    listForumPosts,
    createForumPost,
    getForumPost,
    voteForumPost,
    listForumComments,
    createForumComment,
    voteForumComment,
    ForumCategory,
    ForumPost,
    ForumComment,
    ForumListPostsParams,
    APIError,
    CreateForumPostRequest,
    CreateForumCommentRequest
} from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

interface ForumManagerProps {
    projectId?: string; // Optional if we want to filter by project context, though forum is global
}

export default function ForumManager({ projectId }: ForumManagerProps) {
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'latest' | 'most_votes' | 'most_comments' | 'most_views'>('latest');

    // Create Post Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostCategoryId, setNewPostCategoryId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Detail Modal State
    const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [comments, setComments] = useState<ForumComment[]>([]);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    // User Vote Tracking (Local session)
    const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});
    const [userCommentVotes, setUserCommentVotes] = useState<Record<string, 'up' | 'down' | null>>({});

    useEffect(() => {
        loadCategories();
        loadPosts();
    }, [selectedCategory, sortBy]);

    const loadCategories = async () => {
        try {
            const cats = await listForumCategories();
            console.log('Categories loaded:', cats);
            setCategories(cats);

            // If we have categories and none is selected for creation, pick the first one
            if (cats.length > 0 && !newPostCategoryId) {
                setNewPostCategoryId(cats[0].id);
            }
        } catch (err: any) {
            console.error('Failed to load categories:', err);
            setError(`Could not load categories: ${err.message || 'Unknown error'}`);
            toast.error('Failed to load forum categories');
        }
    };

    const loadPosts = async () => {
        setIsLoading(true);
        try {
            const params: ForumListPostsParams = {
                limit: 20,
                sort: sortBy,
            };
            if (selectedCategory) params.category = selectedCategory;
            if (searchQuery) params.search = searchQuery;

            const response = await listForumPosts(params);
            setPosts(response.posts);
            setTotalPosts(response.total);
        } catch (err) {
            setError('Failed to load posts');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadPosts();
    };

    const handleVote = async (postId: string, voteType: 'up' | 'down', e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        const currentVote = userVotes[postId];

        try {
            await voteForumPost(postId, voteType);

            // Dynamic delta calculation based on toggle/change
            let upDelta = 0;
            let downDelta = 0;
            let nextVote: 'up' | 'down' | null = voteType;

            if (currentVote === voteType) {
                // Toggling off
                if (voteType === 'up') upDelta = -1;
                else downDelta = -1;
                nextVote = null;
            } else if (currentVote) {
                // Changing vote
                if (voteType === 'up') {
                    upDelta = 1;
                    downDelta = -1;
                } else {
                    upDelta = -1;
                    downDelta = 1;
                }
            } else {
                // New vote
                if (voteType === 'up') upDelta = 1;
                else downDelta = 1;
            }

            // Update tracked votes
            setUserVotes(prev => ({ ...prev, [postId]: nextVote }));

            // Optimistic update for list
            setPosts(prev => prev.map(p => {
                if (p.id === postId) {
                    return {
                        ...p,
                        upVotes: Math.max(0, (p.upVotes || 0) + upDelta),
                        downVotes: Math.max(0, (p.downVotes || 0) + downDelta)
                    };
                }
                return p;
            }));

            // Sync with selected post if open
            if (selectedPost?.id === postId) {
                setSelectedPost(prev => prev ? {
                    ...prev,
                    upVotes: Math.max(0, (prev.upVotes || 0) + upDelta),
                    downVotes: Math.max(0, (prev.downVotes || 0) + downDelta)
                } : null);
            }

            if (nextVote) toast.success(`Post ${voteType}voted!`);
            else toast.success('Vote removed');
        } catch (err: any) {
            toast.error(err.message || 'Failed to vote');
        }
    };

    const handleVoteComment = async (commentId: string, voteType: 'up' | 'down') => {
        const currentVote = userCommentVotes[commentId];

        try {
            await voteForumComment(commentId, voteType);

            let upDelta = 0;
            let downDelta = 0;
            let nextVote: 'up' | 'down' | null = voteType;

            if (currentVote === voteType) {
                if (voteType === 'up') upDelta = -1;
                else downDelta = -1;
                nextVote = null;
            } else if (currentVote) {
                if (voteType === 'up') { upDelta = 1; downDelta = -1; }
                else { upDelta = -1; downDelta = 1; }
            } else {
                if (voteType === 'up') upDelta = 1;
                else downDelta = 1;
            }

            setUserCommentVotes(prev => ({ ...prev, [commentId]: nextVote }));

            setComments(prev => prev.map(c => {
                if (c.id === commentId) {
                    return {
                        ...c,
                        upVotes: Math.max(0, (c.upVotes || 0) + upDelta),
                        downVotes: Math.max(0, (c.downVotes || 0) + downDelta)
                    };
                }
                return c;
            }));

            if (nextVote) toast.success('Comment vote recorded');
            else toast.success('Comment vote removed');
        } catch (err: any) {
            toast.error(err.message || 'Failed to vote on comment');
        }
    };

    const handleOpenPost = async (post: ForumPost) => {
        setIsDetailModalOpen(true);
        loadComments(post.id);

        try {
            // Fetch fresh data. Backend increments view count on GET /posts/:id
            const freshPost = await getForumPost(post.id);
            setSelectedPost(freshPost);

            // Sync the updated view count back to the main list
            setPosts(prev => prev.map(p => p.id === post.id ? { ...p, viewCount: freshPost.viewCount } : p));
        } catch (err) {
            console.error('Failed to fetch full post details:', err);
            // Fallback to the post data we already have if the fetch fails
            setSelectedPost(post);
        }
    };

    const loadComments = async (postId: string) => {
        setIsLoadingComments(true);
        try {
            const res = await listForumComments(postId);
            setComments(res.comments);
        } catch (err) {
            console.error('Failed to load comments:', err);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleCreateComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPost || !newCommentContent.trim()) return;

        setIsCommenting(true);
        try {
            await createForumComment(selectedPost.id, { content: newCommentContent });
            toast.success('Comment posted!');
            setNewCommentContent('');
            loadComments(selectedPost.id);
            // Update comment count in list
            setPosts(prev => prev.map(p => p.id === selectedPost.id ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p));
        } catch (err: any) {
            toast.error(err.message || 'Failed to post comment');
        } finally {
            setIsCommenting(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();

        // Detailed validation to match backend requirements
        if (!newPostCategoryId) {
            toast.error('Please select a category');
            return;
        }
        if (!newPostTitle || newPostTitle.trim().length < 5) {
            toast.error('Title must be at least 5 characters long');
            return;
        }
        if (!newPostContent || newPostContent.trim().length < 10) {
            toast.error('Content must be at least 10 characters long');
            return;
        }

        setIsSubmitting(true);
        try {
            const req: CreateForumPostRequest = {
                title: newPostTitle,
                content: newPostContent,
                categoryId: newPostCategoryId,
                tags: [] // Backend expects an array
            };
            await createForumPost(req);
            toast.success('Discussion created successfully!');
            setIsCreateModalOpen(false);
            setNewPostTitle('');
            setNewPostContent('');
            loadPosts();
        } catch (err: any) {
            console.error('Create post error:', err);
            // If it's an APIError, it will have a message from the backend
            toast.error(err.message || 'Failed to create discussion');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500 text-sm font-medium">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button
                        onClick={() => { setError(''); loadCategories(); loadPosts(); }}
                        className="ml-auto underline underline-offset-4 hover:no-underline"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Community Forum</h2>
                    <p className="text-zinc-500 text-sm font-medium">Discuss, share and learn with other Afribase developers.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95"
                >
                    <Plus size={16} />
                    New Discussion
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sidebar - Categories */}
                <div className="w-full lg:w-64 space-y-6 shrink-0">
                    <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Categories</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all ${selectedCategory === null
                                    ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${selectedCategory === null ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                                    <span>All Discussions</span>
                                </div>
                                <span className="text-[10px] font-bold opacity-50">{totalPosts}</span>
                            </button>

                            {categories.length === 0 && !error && (
                                <div className="p-3 flex items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                                    <Loader2 size={12} className="animate-spin" />
                                    Loading...
                                </div>
                            )}

                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.slug)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all ${selectedCategory === cat.slug
                                        ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: cat.color || '#3B82F6' }}
                                        />
                                        <span>{cat.name}</span>
                                    </div>
                                    <span className="text-[10px] font-bold opacity-50">{cat.postCount}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Trending Tags</h3>
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
                            {['authentication', 'postgresql', 'rls', 'edge-functions', 'typescript'].map(tag => (
                                <button key={tag} className="px-3 py-1.5 bg-white/5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content - Post List */}
                <div className="flex-1 w-full space-y-4">
                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search discussions..."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                            />
                        </form>
                        <div className="flex items-center gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:outline-none cursor-pointer hover:bg-white/5 transition-all"
                            >
                                <option value="latest">Latest</option>
                                <option value="most_votes">Top Voted</option>
                                <option value="most_comments">Most Discussion</option>
                                <option value="most_views">Popular</option>
                            </select>
                        </div>
                    </div>

                    {/* Posts List */}
                    <div className="space-y-3">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 animate-pulse">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5" />
                                        <div className="flex-1 space-y-4">
                                            <div className="h-4 bg-white/5 rounded-full w-3/4" />
                                            <div className="h-3 bg-white/5 rounded-full w-1/2" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <div
                                    key={post.id}
                                    onClick={() => handleOpenPost(post)}
                                    className="group glass-card rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.02] transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex gap-5 relative z-10">
                                        {/* Voting */}
                                        <div className="flex flex-col items-center gap-1 shrink-0 bg-white/5 rounded-xl px-2 py-3 h-fit border border-white/5">
                                            <button
                                                onClick={(e) => handleVote(post.id, 'up', e)}
                                                className={`transition-colors ${userVotes[post.id] === 'up' ? 'text-emerald-400' : 'text-zinc-500 hover:text-emerald-400'}`}
                                            >
                                                <ThumbsUp size={16} className={userVotes[post.id] === 'up' ? 'fill-emerald-400' : ''} />
                                            </button>
                                            <span className={`text-xs font-black transition-colors ${userVotes[post.id] === 'up' ? 'text-emerald-400' : userVotes[post.id] === 'down' ? 'text-red-400' : 'text-white'}`}>
                                                {(post.upVotes || 0) - (post.downVotes || 0)}
                                            </span>
                                            <button
                                                onClick={(e) => handleVote(post.id, 'down', e)}
                                                className={`transition-colors ${userVotes[post.id] === 'down' ? 'text-red-400' : 'text-zinc-500 hover:text-red-400'}`}
                                            >
                                                <ThumbsDown size={16} className={userVotes[post.id] === 'down' ? 'fill-red-400' : ''} />
                                            </button>
                                        </div>

                                        {/* Post Info */}
                                        <div className="flex-1 min-w-0 space-y-3">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        {post.isPinned && <Pin size={12} className="text-emerald-400 fill-emerald-400" />}
                                                        <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">{post.title}</h4>
                                                        {post.status === 'resolved' && (
                                                            <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">Resolved</div>
                                                        )}
                                                    </div>
                                                    <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">{post.content}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-y-3 gap-x-6">
                                                <div className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                                                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-400 font-black">
                                                        {post.author?.fullName?.charAt(0) || 'U'}
                                                    </div>
                                                    <span className="text-xs font-bold">{post.author?.fullName || 'User'}</span>
                                                </div>

                                                <div className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: post.category?.color || '#3B82F6' }}
                                                    />
                                                    {post.category?.name || 'General'}
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5 text-zinc-600">
                                                        <MessageCircle size={14} />
                                                        <span className="text-xs font-bold">{post.commentCount || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-zinc-600">
                                                        <Eye size={14} />
                                                        <span className="text-xs font-bold">{post.viewCount || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-zinc-600">
                                                        <Clock size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight size={20} className="text-zinc-600" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="glass-card rounded-[32px] p-12 border border-white/5 text-center space-y-4">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-zinc-600">
                                    <MessageSquare size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white">No discussions found</h3>
                                    <p className="text-zinc-500 text-sm">Be the first to start a conversation in this category.</p>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all active:scale-95"
                                >
                                    Start Discussion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Discussion Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Start New Discussion"
                footer={
                    <>
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreatePost}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={12} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Post Discussion'
                            )}
                        </button>
                    </>
                }
            >
                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Category</label>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setNewPostCategoryId(cat.id)}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${newPostCategoryId === cat.id
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                        : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/10 hover:text-white'
                                        }`}
                                >
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                    <span className="text-xs font-bold truncate">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Title</label>
                        <input
                            type="text"
                            value={newPostTitle}
                            onChange={(e) => setNewPostTitle(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Content (Markdown supported)</label>
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Share your thoughts, ask a question, or provide feedback..."
                            rows={6}
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all resize-none font-medium leading-relaxed"
                        />
                    </div>
                </form>
            </Modal>

            {/* Post Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title={selectedPost?.title || 'Discussion'}
            >
                {selectedPost && (
                    <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        {/* Main Post */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-black font-black">
                                    {selectedPost.author?.fullName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-0.5">{selectedPost.author?.fullName || 'Anonymous'}</h4>
                                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                        <span>In {selectedPost.category?.name}</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                        <span>{formatDistanceToNow(new Date(selectedPost.createdAt), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                <p className="text-zinc-300 leading-relaxed text-sm whitespace-pre-wrap">{selectedPost.content}</p>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleVote(selectedPost.id, 'up')}
                                                className={`p-2 rounded-lg transition-all border ${userVotes[selectedPost.id] === 'up'
                                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-white/5 text-zinc-400 border-white/5 hover:text-emerald-400'}`}
                                            >
                                                <ThumbsUp size={16} className={userVotes[selectedPost.id] === 'up' ? 'fill-emerald-400' : ''} />
                                            </button>
                                            <span className={`text-xs font-black px-2 ${userVotes[selectedPost.id] === 'up' ? 'text-emerald-400' : userVotes[selectedPost.id] === 'down' ? 'text-red-400' : 'text-white'}`}>
                                                {(selectedPost.upVotes || 0) - (selectedPost.downVotes || 0)}
                                            </span>
                                            <button
                                                onClick={() => handleVote(selectedPost.id, 'down')}
                                                className={`p-2 rounded-lg transition-all border ${userVotes[selectedPost.id] === 'down'
                                                    ? 'bg-red-500/20 text-red-400 border-red-500/20'
                                                    : 'bg-white/5 text-zinc-400 border-white/5 hover:text-red-400'}`}
                                            >
                                                <ThumbsDown size={16} className={userVotes[selectedPost.id] === 'down' ? 'fill-red-400' : ''} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <MessageCircle size={16} />
                                            <span className="text-xs font-bold">{selectedPost.commentCount || 0} Comments</span>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white tracking-widest transition-colors">
                                        <Share2 size={14} /> Share
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="space-y-6">
                            <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                Comments {isLoadingComments && <Loader2 size={12} className="animate-spin" />}
                            </h5>

                            {/* Comment Form */}
                            <form onSubmit={handleCreateComment} className="relative group">
                                <textarea
                                    value={newCommentContent}
                                    onChange={(e) => setNewCommentContent(e.target.value)}
                                    placeholder="Write a helpful comment..."
                                    rows={3}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all resize-none font-medium leading-relaxed pr-12"
                                />
                                <button
                                    type="submit"
                                    disabled={isCommenting || !newCommentContent.trim()}
                                    className="absolute right-3 bottom-3 p-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-20 text-black rounded-xl transition-all shadow-lg active:scale-90"
                                >
                                    {isCommenting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                </button>
                            </form>

                            {/* Comments List */}
                            <div className="space-y-4">
                                {comments.length === 0 && !isLoadingComments ? (
                                    <div className="py-8 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
                                        <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">No comments yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-4 group">
                                            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-zinc-600 shrink-0">
                                                {comment.author?.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-bold text-white">{comment.author?.fullName || 'Anonymous'}</span>
                                                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <p className="text-zinc-400 text-sm leading-relaxed">{comment.content}</p>
                                                </div>
                                                <div className="flex items-center gap-4 px-2">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleVoteComment(comment.id, 'up')}
                                                            className={`transition-colors ${userCommentVotes[comment.id] === 'up' ? 'text-emerald-400' : 'text-zinc-600 hover:text-emerald-400'}`}
                                                        >
                                                            <ThumbsUp size={12} className={userCommentVotes[comment.id] === 'up' ? 'fill-emerald-400' : ''} />
                                                        </button>
                                                        <span className={`text-[10px] font-black transition-colors ${userCommentVotes[comment.id] === 'up' ? 'text-emerald-400' : userCommentVotes[comment.id] === 'down' ? 'text-red-400' : 'text-zinc-500'}`}>
                                                            {(comment.upVotes || 0) - (comment.downVotes || 0)}
                                                        </span>
                                                        <button
                                                            onClick={() => handleVoteComment(comment.id, 'down')}
                                                            className={`transition-colors ${userCommentVotes[comment.id] === 'down' ? 'text-red-400' : 'text-zinc-600 hover:text-red-400'}`}
                                                        >
                                                            <ThumbsDown size={12} className={userCommentVotes[comment.id] === 'down' ? 'fill-red-400' : ''} />
                                                        </button>
                                                    </div>
                                                    <button className="text-[10px] font-black uppercase text-zinc-700 hover:text-zinc-400 tracking-widest transition-colors">Reply</button>
                                                    <button className="text-[10px] font-black uppercase text-zinc-800 hover:text-red-500/50 tracking-widest transition-colors ml-auto opacity-0 group-hover:opacity-100 uppercase flex items-center gap-1">
                                                        <Flag size={10} /> Report
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
