import React, { useState, useEffect } from 'react';
import { HardDrive, Plus, Trash2, FolderOpen, Loader2, UploadCloud, RefreshCw, Eye, EyeOff } from 'lucide-react';
import {
    StorageBucket,
    StorageObject,
    getStorageBuckets,
    createStorageBucket,
    deleteStorageBucket,
    getStorageObjects,
    deleteStorageObject
} from '@/lib/api';
import toast from 'react-hot-toast';
import { useConfirm } from '@/lib/hooks/useConfirm';

interface StorageManagerProps {
    projectId: string;
}

export default function StorageManager({ projectId }: StorageManagerProps) {
    const { confirm, ConfirmDialog } = useConfirm();
    const [buckets, setBuckets] = useState<StorageBucket[]>([]);
    const [selectedBucket, setSelectedBucket] = useState<StorageBucket | null>(null);
    const [objects, setObjects] = useState<StorageObject[]>([]);

    const [loading, setLoading] = useState(true);
    const [objectsLoading, setObjectsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create bucket state
    const [newBucketName, setNewBucketName] = useState('');
    const [newBucketPublic, setNewBucketPublic] = useState(true);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadBuckets();
    }, [projectId]);

    useEffect(() => {
        if (selectedBucket) {
            loadObjects(selectedBucket.id);
        } else {
            setObjects([]);
        }
    }, [selectedBucket]);

    const loadBuckets = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getStorageBuckets(projectId);
            setBuckets(data || []);
            if (data && data.length > 0 && !selectedBucket) {
                setSelectedBucket(data[0]);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load buckets');
        } finally {
            setLoading(false);
        }
    };

    const loadObjects = async (bucketId: string) => {
        try {
            setObjectsLoading(true);
            const data = await getStorageObjects(projectId, bucketId);
            setObjects(data.objects || []);
        } catch (err: any) {
            console.error('Failed to load objects:', err);
        } finally {
            setObjectsLoading(false);
        }
    };

    const handleCreateBucket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBucketName.trim()) return;

        try {
            setCreating(true);
            const bucket = await createStorageBucket(projectId, newBucketName.trim(), newBucketPublic);
            setBuckets([...buckets, bucket]);
            setNewBucketName('');
            setSelectedBucket(bucket);
        } catch (err: any) {
            setError(err.message || 'Failed to create bucket');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteBucket = async (bucketId: string) => {
        const ok = await confirm({
            title: 'Delete Bucket',
            message: 'Are you sure you want to delete this bucket? All contents will be lost.',
            variant: 'danger',
            confirmText: 'Delete Bucket'
        });
        if (!ok) return;

        try {
            setError(null);
            await deleteStorageBucket(projectId, bucketId);
            setBuckets(buckets.filter(b => b.id !== bucketId));
            if (selectedBucket?.id === bucketId) {
                setSelectedBucket(null);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete bucket. Make sure it is empty first.');
        }
    };

    const handleDeleteObject = async (objectPath: string) => {
        if (!selectedBucket) return;
        const ok = await confirm({
            title: 'Delete Object',
            message: 'Are you sure you want to delete this object?',
            variant: 'danger',
            confirmText: 'Delete Object'
        });
        if (!ok) return;

        try {
            await deleteStorageObject(projectId, selectedBucket.id, objectPath);
            loadObjects(selectedBucket.id);
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete object');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Buckets List Panel */}
                <div className="col-span-1 border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden flex flex-col min-h-[500px]">
                    <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                            <HardDrive size={16} />
                            Buckets
                        </h3>
                        <button
                            onClick={() => setNewBucketName('new-bucket')}
                            className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-100 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <form onSubmit={handleCreateBucket} className="p-3 bg-zinc-900/30 border-b border-zinc-800 space-y-2">
                        <input
                            type="text"
                            placeholder="New bucket name..."
                            value={newBucketName}
                            onChange={(e) => setNewBucketName(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 p-2 text-sm rounded focus:outline-none focus:border-emerald-500 text-zinc-100"
                        />
                        <div className="flex items-center justify-between">
                            <label className="text-xs flex items-center gap-2 cursor-pointer text-zinc-400">
                                <input
                                    type="checkbox"
                                    checked={newBucketPublic}
                                    onChange={(e) => setNewBucketPublic(e.target.checked)}
                                />
                                Public
                            </label>
                            <button
                                type="submit"
                                disabled={creating || !newBucketName.trim()}
                                className="px-3 py-1 bg-zinc-800 text-zinc-100 text-xs font-semibold rounded disabled:opacity-50"
                            >
                                {creating ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </form>

                    <div className="flex-1 overflow-y-auto">
                        {buckets.length === 0 ? (
                            <div className="p-8 text-center text-sm text-zinc-500">
                                No buckets found
                            </div>
                        ) : (
                            <ul className="divide-y divide-zinc-800 h-full">
                                {buckets.map((bucket) => {
                                    const isSelected = selectedBucket?.id === bucket.id;
                                    const itemClass = isSelected
                                        ? "w-full text-left px-4 py-3 bg-zinc-900/80 border-l-2 border-emerald-500 flex justify-between items-center cursor-pointer transition-colors"
                                        : "w-full text-left px-4 py-3 hover:bg-zinc-900 flex justify-between items-center cursor-pointer transition-colors";

                                    return (
                                        <li key={bucket.id}>
                                            <div onClick={() => setSelectedBucket(bucket)} className={itemClass}>
                                                <div className="flex items-center gap-2 truncate">
                                                    {bucket.public ? <Eye size={14} className="text-emerald-500" /> : <EyeOff size={14} className="text-zinc-500" />}
                                                    <span className="text-sm font-medium truncate">{bucket.name}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteBucket(bucket.id); }}
                                                    className="text-zinc-400 hover:text-red-500 opacity-0 group-[.hover]:opacity-100 hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Objects Explorer Panel */}
                <div className="col-span-1 md:col-span-3 border border-zinc-800 rounded-xl bg-zinc-950 flex flex-col h-[500px]">
                    {selectedBucket ? (
                        <>
                            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-sm flex items-center gap-2">
                                        <FolderOpen size={16} className="text-emerald-500" />
                                        {selectedBucket.name}
                                    </h3>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-medium">
                                        {selectedBucket.public ? 'Public' : 'Private'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => loadObjects(selectedBucket.id)}
                                        className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-100 transition-colors"
                                    >
                                        <RefreshCw size={14} />
                                    </button>
                                    <label className="cursor-pointer text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors flex items-center gap-2">
                                        <UploadCloud size={14} />
                                        Upload File
                                        <input type="file" className="hidden" disabled />
                                    </label>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto bg-zinc-950">
                                {objectsLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                                    </div>
                                ) : objects.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-8 text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                                            <FolderOpen size={24} className="text-zinc-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-zinc-100">Bucket is empty</h4>
                                            <p className="text-sm mt-1">Upload files to get started.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 sticky top-0">
                                            <tr>
                                                <th className="px-6 py-3 font-medium">Name</th>
                                                <th className="px-6 py-3 font-medium">Last Modified</th>
                                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800">
                                            {objects.map((obj) => (
                                                <tr key={obj.id || obj.name} className="hover:bg-zinc-900/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-zinc-100">
                                                        {obj.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-zinc-500">
                                                        {obj.updated_at ? new Date(obj.updated_at).toLocaleString() : 'Unknown'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteObject(obj.name)}
                                                            className="text-red-500 hover:text-red-600 font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                            <HardDrive size={32} className="mb-4 text-zinc-400" />
                            <p>Select a bucket to view contents</p>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmDialog />
        </div>
    );
}
