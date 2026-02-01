"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Github, FileCode, Terminal, Image as ImageIcon, File,
    ArrowLeft, LayoutGrid, List as ListIcon, Search, Folder,
    ChevronRight, Clock, Star, Menu, X, Download, Loader2, ExternalLink, Sun, Moon
} from 'lucide-react';
import { type FileNode } from '@/lib/explorer';
import CodeViewer from './CodeViewer';
import { useTheme } from 'next-themes';

type FileType = 'file' | 'dir';

// --- Icons Helper ---
const getFileIcon = (name: string, type: FileType) => {
    if (type === 'dir') return <Folder className="text-blue-400 fill-blue-400/20" size={24} />;
    if (name.endsWith('.wh.cpp') || name.endsWith('.cpp')) return <FileCode className="text-blue-400" size={24} />;
    if (name.endsWith('.py') || name.endsWith('.lua')) return <Terminal className="text-green-400" size={24} />;
    if (name.endsWith('.zip') || name.endsWith('.png') || name.endsWith('.jpg')) return <ImageIcon className="text-purple-400" size={24} />;
    return <File className="text-slate-400" size={24} />;
};

interface DriveClientProps {
    // If at root
    rootData?: {
        windhawkFiles: FileNode[];
        scriptFiles: FileNode[];
        assetFiles: FileNode[];
    };
    // If in a subfolder
    currentPath?: string[];
    folderContent?: FileNode[];
}

export default function DriveClient({ rootData, currentPath, folderContent }: DriveClientProps) {
    const isRoot = !currentPath || currentPath.length === 0;

    // Determine initial category
    const initialCategory = !isRoot && currentPath && currentPath[0] === 'windhawk-source' ? 'windhawk' :
        !isRoot && currentPath && currentPath[0] === 'node-source' ? 'scripts' :
            !isRoot && currentPath && currentPath[0] === 'assets' ? 'assets' : 'windhawk';

    // Theme
    const { theme, setTheme } = useTheme();

    // Categories: 'windhawk' | 'scripts' | 'assets' | 'recent' | 'starred'
    const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State for Recent & Starred
    const [recentFiles, setRecentFiles] = useState<FileNode[]>([]);
    const [starredFiles, setStarredFiles] = useState<FileNode[]>([]);

    // Init from LocalStorage
    useEffect(() => {
        const storedRen = localStorage.getItem('vlc-rpc-recent');
        const storedStar = localStorage.getItem('vlc-rpc-starred');
        if (storedRen) setRecentFiles(JSON.parse(storedRen));
        if (storedStar) setStarredFiles(JSON.parse(storedStar));
    }, []);

    // Persist
    useEffect(() => {
        localStorage.setItem('vlc-rpc-recent', JSON.stringify(recentFiles));
    }, [recentFiles]);

    useEffect(() => {
        localStorage.setItem('vlc-rpc-starred', JSON.stringify(starredFiles));
    }, [starredFiles]);

    // Helpers
    const addToRecent = (file: FileNode) => {
        setRecentFiles(prev => {
            const filtered = prev.filter(f => f.path.join('/') !== file.path.join('/'));
            return [file, ...filtered].slice(0, 20); // Keep last 20
        });
    };

    const toggleStar = (file: FileNode, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setStarredFiles(prev => {
            const exists = prev.find(f => f.path.join('/') === file.path.join('/'));
            if (exists) return prev.filter(f => f.path.join('/') !== file.path.join('/'));
            return [file, ...prev];
        });
    };

    const isStarred = (file: FileNode) => starredFiles.some(f => f.path.join('/') === file.path.join('/'));

    // Preview Modal State
    const [previewFile, setPreviewFile] = useState<FileNode | null>(null);
    const [previewContent, setPreviewContent] = useState<string | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    // Determine files to show
    let displayFiles: FileNode[] = [];
    let categoryLabel = '';

    if (activeCategory === 'recent') {
        displayFiles = recentFiles;
        categoryLabel = 'Recent Files';
    } else if (activeCategory === 'starred') {
        displayFiles = starredFiles;
        categoryLabel = 'Starred Files';
    } else if (isRoot && rootData) {
        if (activeCategory === 'windhawk') displayFiles = rootData.windhawkFiles;
        if (activeCategory === 'scripts') displayFiles = rootData.scriptFiles;
        if (activeCategory === 'assets') displayFiles = rootData.assetFiles;
        categoryLabel = activeCategory === 'windhawk' ? 'Windhawk Mods' : activeCategory === 'scripts' ? 'Scripts' : 'Design Assets';
    } else if (folderContent) {
        displayFiles = folderContent;
        // Keep category active based on path
        categoryLabel = activeCategory === 'windhawk' ? 'Windhawk Mods' : activeCategory === 'scripts' ? 'Scripts' : activeCategory === 'assets' ? 'Design Assets' : 'Files';
    }

    const filteredFiles = displayFiles.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // File Click Handler
    const handleFileClick = async (file: FileNode, e: React.MouseEvent) => {
        if (file.type === 'file') {
            e.preventDefault();
            addToRecent(file);
            setPreviewFile(file);
            setIsLoadingPreview(true);

            const rawUrl = `https://raw.githubusercontent.com/ciizerr/vlc-discord-rpc-archive/main/${file.path.join('/')}`;
            try {
                const res = await fetch(rawUrl);
                if (!res.ok) throw new Error("Failed to load");
                const ext = file.name.split('.').pop()?.toLowerCase();
                if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext || '')) {
                    setPreviewContent(rawUrl);
                } else {
                    const text = await res.text();
                    setPreviewContent(text);
                }
            } catch {
                setPreviewContent("Error loading preview.");
            } finally {
                setIsLoadingPreview(false);
            }
        }
    };

    const closePreview = () => {
        setPreviewFile(null);
        setPreviewContent(null);
    };

    const categoriesList = [
        { key: 'windhawk', label: 'Windhawk Mods', icon: <FileCode size={18} /> },
        { key: 'scripts', label: 'Scripts', icon: <Terminal size={18} /> },
        { key: 'assets', label: 'Design Assets', icon: <ImageIcon size={18} /> },
    ];

    return (
        <div className="flex flex-1 min-h-0 w-full gap-6 relative">

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 md:bg-transparent transition-transform duration-300 transform 
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                flex flex-col gap-6 md:h-auto h-full p-6 md:p-0 border-r md:border-r-0 border-slate-200 dark:border-slate-800
            `}>
                <div className="flex items-center justify-between md:hidden mb-4">
                    <span className="font-bold text-lg dark:text-white">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="dark:text-white"><X /></button>
                </div>

                <div className="flex-1 p-4 flex flex-col gap-2 rounded-2xl md:bg-white/50 md:dark:bg-slate-950/50 md:backdrop-blur-xl md:border md:border-slate-200 md:dark:border-slate-800 md:shadow-sm overflow-y-auto">
                    <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        My Archive
                    </div>

                    {categoriesList.map(cat => (
                        <Link
                            key={cat.key}
                            href={isRoot ? '#' : '/archive'}
                            onClick={(e) => {
                                if (isRoot) {
                                    e.preventDefault();
                                    setActiveCategory(cat.key);
                                }
                                setIsMobileMenuOpen(false);
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat.key
                                ? 'bg-orange-500/10 text-orange-500'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 md:hover:bg-white/40 md:dark:hover:bg-slate-800/40'
                                }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </Link>
                    ))}

                    <div className="mt-8 px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Locations
                    </div>

                    <button
                        onClick={() => { setActiveCategory('recent'); setIsMobileMenuOpen(false); }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === 'recent'
                            ? 'bg-orange-500/10 text-orange-500'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
                            }`}
                    >
                        <Clock size={18} /> Recent
                    </button>
                    <button
                        onClick={() => { setActiveCategory('starred'); setIsMobileMenuOpen(false); }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === 'starred'
                            ? 'bg-orange-500/10 text-orange-500'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
                            }`}
                    >
                        <Star size={18} /> Starred
                    </button>

                    <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                        <a
                            href="https://github.com/ciizerr/vlc-discord-rpc-archive"
                            target="_blank"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors"
                        >
                            <Github size={18} /> View Repository <ExternalLink size={12} className="opacity-50" />
                        </a>
                    </div>

                    <div className="mt-auto p-4 flex flex-col gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors"
                        >
                            <ArrowLeft size={18} /> Back to Home
                        </Link>

                        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/50">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Theme</span>
                            <div className="flex bg-white dark:bg-slate-900 rounded-lg p-0.5 shadow-sm border border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`p-1.5 rounded-md transition-all ${theme === 'light' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Sun size={14} />
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`p-1.5 rounded-md transition-all ${theme === 'dark' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Moon size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden rounded-2xl bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-sm relative z-0">
                {/* Toolbar */}
                <div className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between gap-4 bg-white/30 dark:bg-slate-900/30">
                    <div className="flex items-center gap-2 text-lg font-bold min-w-0">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden mr-2 p-1 text-slate-500 dark:text-slate-400">
                            <Menu size={20} />
                        </button>

                        {!isRoot && (
                            <Link href={currentPath?.length && currentPath.length > 1 ? `/archive/${currentPath.slice(0, -1).join('/')}` : '/archive'} className="text-slate-400 hover:text-orange-500 transition-colors flex-shrink-0">
                                <ArrowLeft size={18} />
                            </Link>
                        )}

                        <div className="flex items-center gap-2 truncate">
                            <span className="text-slate-500 dark:text-slate-500 hidden md:inline">Archive</span>
                            <ChevronRight size={16} className="text-slate-400 dark:text-slate-600 hidden md:inline" />
                            {isRoot ? (
                                <span className="text-slate-900 dark:text-white truncate">{categoryLabel}</span>
                            ) : (
                                <span className="text-slate-900 dark:text-white truncate">{currentPath?.[currentPath.length - 1]}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="relative group hidden md:block">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-100/50 dark:bg-slate-800/50 border border-transparent focus:border-orange-500/50 rounded-full px-10 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all w-64"
                            />
                        </div>
                        <div className="flex bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/80 dark:bg-slate-700/80 text-orange-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                <ListIcon size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/80 dark:bg-slate-700/80 text-orange-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* File View */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/30 dark:bg-slate-950/30">
                    {filteredFiles.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600 gap-4">
                            <Folder size={64} className="opacity-20" />
                            <p>No files found</p>
                        </div>
                    )}

                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                            {filteredFiles.map(file => (
                                <Link
                                    key={file.path.join('/')}
                                    href={`/archive/${file.path.join('/')}`}
                                    onClick={(e) => handleFileClick(file, e)}
                                    className="group flex flex-col gap-2 p-3 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm relative"
                                >
                                    {/* Star Button */}
                                    <button
                                        onClick={(e) => toggleStar(file, e)}
                                        className={`absolute top-2 right-2 p-1.5 rounded-full z-10 transition-all ${isStarred(file)
                                            ? 'text-yellow-400 bg-white dark:bg-slate-800 shadow-sm opacity-100'
                                            : 'text-slate-300 opacity-0 group-hover:opacity-100 check-hover:opacity-100 hover:text-yellow-400 hover:bg-white dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <Star size={14} fill={isStarred(file) ? "currentColor" : "none"} />
                                    </button>

                                    <div className="aspect-[4/3] bg-white/60 dark:bg-slate-900/60 rounded-lg border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center overflow-hidden relative">
                                        <div className="group-hover:scale-110 transition-transform duration-300 relative z-0">
                                            {getFileIcon(file.name, file.type)}
                                        </div>
                                    </div>
                                    <div className="px-1 min-w-0">
                                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate group-hover:text-orange-500 transition-colors">
                                            {file.name}
                                        </div>
                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                                            {file.type === 'dir' ? 'Folder' : file.size ? (file.size / 1024).toFixed(1) + ' KB' : 'Unknown'}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                                <span className="w-8"></span>
                                <span>Name</span>
                                <span>Size</span>
                                <span></span>
                                <span>Action</span>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredFiles.map(file => (
                                    <Link
                                        key={file.path.join('/')}
                                        href={`/archive/${file.path.join('/')}`}
                                        onClick={(e) => handleFileClick(file, e)}
                                        className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                                    >
                                        <div className="w-8 flex justify-center text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                                            {getFileIcon(file.name, file.type)}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-orange-500 transition-colors truncate">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                                            {file.type === 'dir' ? '-' : file.size ? (file.size / 1024).toFixed(1) + ' KB' : '-'}
                                        </span>
                                        <button
                                            onClick={(e) => toggleStar(file, e)}
                                            className={`p-1.5 rounded-full transition-all ${isStarred(file)
                                                ? 'text-yellow-400'
                                                : 'text-slate-300 opacity-0 group-hover:opacity-100 hover:text-yellow-400'
                                                }`}
                                        >
                                            <Star size={14} fill={isStarred(file) ? "currentColor" : "none"} />
                                        </button>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="p-1.5 bg-slate-100/50 dark:bg-slate-700/50 rounded text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-600/50">
                                                {file.type === 'dir' ? <ChevronRight size={14} /> : <ArrowLeft size={12} className="rotate-180" />}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* PREVIEW MODAL */}
            {previewFile && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && closePreview()}>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

                    <div className="relative z-10 bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                            <div className="flex items-center gap-3">
                                {getFileIcon(previewFile.name, 'file')}
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{previewFile.name}</h3>
                                    <p className="text-xs text-slate-500">{(previewFile.size! / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => toggleStar(previewFile, e)}
                                    className={`p-2 rounded-lg transition-colors ${isStarred(previewFile) ? 'text-yellow-400 bg-slate-200 dark:bg-slate-800' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                                    title={isStarred(previewFile) ? "Unstar" : "Star"}
                                >
                                    <Star size={20} fill={isStarred(previewFile) ? "currentColor" : "none"} />
                                </button>
                                <a
                                    href={`https://raw.githubusercontent.com/ciizerr/vlc-discord-rpc-archive/main/${previewFile.path.join('/')}`}
                                    target="_blank"
                                    download
                                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
                                >
                                    <Download size={20} />
                                </a>
                                <button onClick={closePreview} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950/50 p-0 relative min-h-[300px]">
                            {isLoadingPreview ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-orange-500" size={32} />
                                </div>
                            ) : previewContent ? (
                                previewContent.startsWith('http') ? (
                                    <div className="flex items-center justify-center h-full p-8">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewContent} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg shadow-md" />
                                    </div>
                                ) : (
                                    <CodeViewer code={previewContent} language={previewFile.name.split('.').pop() || 'text'} />
                                )
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-500">
                                    Failed to load preview.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
