"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Github, FileCode, Terminal, Image as ImageIcon, File,
    ArrowLeft, LayoutGrid, List as ListIcon, Search, Folder,
    ChevronRight, Clock, Star, Menu, X, Download, Loader2, ExternalLink
} from 'lucide-react';
import { type FileNode } from '@/lib/explorer';
import CodeViewer from './CodeViewer';

type FileType = 'file' | 'dir';

// --- Icons Helper ---
const getFileIcon = (name: string, type: FileType) => {
    if (type === 'dir') return <Folder className="text-[#FF9500] fill-[#FF9500]/10" size={24} />;
    if (name.endsWith('.wh.cpp') || name.endsWith('.cpp')) return <FileCode className="text-orange-400" size={24} />;
    if (name.endsWith('.py') || name.endsWith('.lua')) return <Terminal className="text-emerald-400" size={24} />;
    if (name.endsWith('.zip') || name.endsWith('.png') || name.endsWith('.jpg')) return <ImageIcon className="text-purple-400" size={24} />;
    return <File className="text-[#52525b]" size={24} />;
};

interface DriveClientProps {
    rootData?: {
        windhawkFiles: FileNode[];
        scriptFiles: FileNode[];
        assetFiles: FileNode[];
    };
    currentPath?: string[];
    folderContent?: FileNode[];
}

export default function DriveClient({ rootData, currentPath, folderContent }: DriveClientProps) {
    const isRoot = !currentPath || currentPath.length === 0;

    const initialCategory = !isRoot && currentPath && currentPath[0] === 'windhawk-source' ? 'windhawk' :
        !isRoot && currentPath && currentPath[0] === 'node-source' ? 'scripts' :
            !isRoot && currentPath && currentPath[0] === 'assets' ? 'assets' : 'windhawk';

    const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [recentFiles, setRecentFiles] = useState<FileNode[]>([]);
    const [starredFiles, setStarredFiles] = useState<FileNode[]>([]);

    useEffect(() => {
        const storedRen = localStorage.getItem('vlc-rpc-recent');
        const storedStar = localStorage.getItem('vlc-rpc-starred');
        if (storedRen) setRecentFiles(JSON.parse(storedRen));
        if (storedStar) setStarredFiles(JSON.parse(storedStar));
    }, []);

    useEffect(() => {
        localStorage.setItem('vlc-rpc-recent', JSON.stringify(recentFiles));
    }, [recentFiles]);

    useEffect(() => {
        localStorage.setItem('vlc-rpc-starred', JSON.stringify(starredFiles));
    }, [starredFiles]);

    const addToRecent = (file: FileNode) => {
        setRecentFiles(prev => {
            const filtered = prev.filter(f => f.path.join('/') !== file.path.join('/'));
            return [file, ...filtered].slice(0, 20);
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

    const [previewFile, setPreviewFile] = useState<FileNode | null>(null);
    const [previewContent, setPreviewContent] = useState<string | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

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
        categoryLabel = activeCategory === 'windhawk' ? 'Windhawk Mods' : activeCategory === 'scripts' ? 'Scripts' : activeCategory === 'assets' ? 'Design Assets' : 'Files';
    }

    const filteredFiles = displayFiles.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#111113] md:bg-transparent transition-transform duration-300 transform 
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                flex flex-col gap-6 md:h-auto h-full p-6 md:p-0 border-r md:border-r-0 border-white/[0.06]
            `}>
                <div className="flex items-center justify-between md:hidden mb-4">
                    <span className="font-bold text-lg text-white">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#a1a1aa]"><X /></button>
                </div>

                <div className="flex-1 p-2 flex flex-col gap-1 rounded-xl md:bg-[#111113] md:border md:border-white/[0.06] md:shadow-xl overflow-y-auto">
                    <div className="px-3 py-4 text-[10px] font-bold text-[#52525b] uppercase tracking-[0.15em]">
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
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${activeCategory === cat.key
                                ? 'bg-[#FF9500] text-[#09090b]'
                                : 'text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]'
                                }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </Link>
                    ))}

                    <div className="mt-8 px-3 py-4 text-[10px] font-bold text-[#52525b] uppercase tracking-[0.15em]">
                        Locations
                    </div>

                    <button
                        onClick={() => { setActiveCategory('recent'); setIsMobileMenuOpen(false); }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${activeCategory === 'recent'
                            ? 'bg-[#FF9500] text-[#09090b]'
                            : 'text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]'
                            }`}
                    >
                        <Clock size={18} /> Recent
                    </button>
                    <button
                        onClick={() => { setActiveCategory('starred'); setIsMobileMenuOpen(false); }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${activeCategory === 'starred'
                            ? 'bg-[#FF9500] text-[#09090b]'
                            : 'text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]'
                            }`}
                    >
                        <Star size={18} /> Starred
                    </button>

                    <div className="mt-6 pt-6 border-t border-white/[0.06]">
                        <a
                            href="https://github.com/ciizerr/vlc-discord-rpc-archive"
                            target="_blank"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-[#a1a1aa] hover:text-white hover:bg-white/[0.04] transition-all"
                        >
                            <Github size={18} /> View Repository <ExternalLink size={12} className="opacity-50" />
                        </a>
                    </div>

                    <div className="mt-auto p-2 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-[#a1a1aa] hover:text-[#FF9500] hover:bg-white/[0.04] transition-all"
                        >
                            <ArrowLeft size={18} /> Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden rounded-xl bg-[#111113] border border-white/[0.06] shadow-2xl relative z-0">
                {/* Toolbar */}
                <div className="h-16 flex-shrink-0 border-b border-white/[0.06] px-4 md:px-6 flex items-center justify-between gap-4 bg-white/[0.02]">
                    <div className="flex items-center gap-2 text-lg font-bold min-w-0">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden mr-2 p-1 text-[#a1a1aa]">
                            <Menu size={20} />
                        </button>

                        {!isRoot && (
                            <Link href={currentPath?.length && currentPath.length > 1 ? `/archive/${currentPath.slice(0, -1).join('/')}` : '/archive'} className="text-[#52525b] hover:text-[#FF9500] transition-colors flex-shrink-0">
                                <ArrowLeft size={18} />
                            </Link>
                        )}

                        <div className="flex items-center gap-2 truncate">
                            <span className="text-[#52525b] hidden md:inline text-sm uppercase tracking-wider font-bold">Archive</span>
                            <ChevronRight size={16} className="text-white/[0.06] hidden md:inline" />
                            {isRoot ? (
                                <span className="text-white truncate text-sm font-bold uppercase tracking-wider">{categoryLabel}</span>
                            ) : (
                                <span className="text-white truncate text-sm font-bold uppercase tracking-wider">{currentPath?.[currentPath.length - 1]}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="relative group hidden md:block">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b] group-focus-within:text-[#FF9500] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white/[0.04] border border-transparent focus:border-[#FF9500]/30 rounded-lg px-10 py-2 text-sm text-white placeholder-[#52525b] focus:outline-none focus:ring-1 focus:ring-[#FF9500]/20 transition-all w-64"
                            />
                        </div>
                        <div className="flex bg-white/[0.04] rounded-lg p-1 border border-white/[0.06]">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#FF9500] text-[#09090b]' : 'text-[#a1a1aa] hover:text-white'}`}
                            >
                                <ListIcon size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#FF9500] text-[#09090b]' : 'text-[#a1a1aa] hover:text-white'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* File View */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0d0d0f]">
                    {filteredFiles.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-[#3f3f46] gap-4">
                            <Folder size={64} className="opacity-10" />
                            <p className="text-sm font-semibold tracking-wide">No files found</p>
                        </div>
                    )}

                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                            {filteredFiles.map(file => (
                                <Link
                                    key={file.path.join('/')}
                                    href={`/archive/${file.path.join('/')}`}
                                    onClick={(e) => handleFileClick(file, e)}
                                    className="group flex flex-col gap-2 p-3 rounded-xl hover:bg-white/[0.02] transition-all cursor-pointer border border-transparent hover:border-white/[0.06] hover:shadow-2xl relative"
                                >
                                    <button
                                        onClick={(e) => toggleStar(file, e)}
                                        className={`absolute top-2 right-2 p-1.5 rounded-full z-10 transition-all ${isStarred(file)
                                            ? 'text-[#FF9500] bg-white/[0.04] shadow-sm opacity-100'
                                            : 'text-[#3f3f46] opacity-0 group-hover:opacity-100 hover:text-[#FF9500] hover:bg-white/[0.04]'
                                            }`}
                                    >
                                        <Star size={14} fill={isStarred(file) ? "currentColor" : "none"} />
                                    </button>

                                    <div className="aspect-[4/3] bg-white/[0.02] rounded-lg border border-white/[0.04] flex items-center justify-center overflow-hidden relative">
                                        <div className="group-hover:scale-110 transition-transform duration-500 relative z-0">
                                            {getFileIcon(file.name, file.type)}
                                        </div>
                                    </div>
                                    <div className="px-1 min-w-0">
                                        <div className="text-[13px] font-semibold text-[#a1a1aa] truncate group-hover:text-white transition-colors">
                                            {file.name}
                                        </div>
                                        <div className="text-[10px] text-[#52525b] mt-0.5 font-mono font-bold">
                                            {file.type === 'dir' ? 'Folder' : file.size ? (file.size / 1024).toFixed(1) + ' KB' : 'Unknown'}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full bg-white/[0.02] rounded-xl border border-white/[0.04] overflow-hidden">
                            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-3 text-[10px] font-bold text-[#52525b] uppercase tracking-[0.15em] border-b border-white/[0.04] bg-white/[0.02]">
                                <span className="w-8"></span>
                                <span>Name</span>
                                <span>Size</span>
                                <span></span>
                                <span className="text-right">Action</span>
                            </div>
                            <div className="divide-y divide-white/[0.04]">
                                {filteredFiles.map(file => (
                                    <Link
                                        key={file.path.join('/')}
                                        href={`/archive/${file.path.join('/')}`}
                                        onClick={(e) => handleFileClick(file, e)}
                                        className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-6 py-3 hover:bg-white/[0.04] transition-colors group"
                                    >
                                        <div className="w-8 flex justify-center text-[#52525b] group-hover:text-[#FF9500] transition-colors">
                                            {getFileIcon(file.name, file.type)}
                                        </div>
                                        <span className="text-[13px] font-semibold text-[#a1a1aa] group-hover:text-white transition-colors truncate">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-[#52525b] font-mono font-bold">
                                            {file.type === 'dir' ? '-' : file.size ? (file.size / 1024).toFixed(1) + ' KB' : '-'}
                                        </span>
                                        <button
                                            onClick={(e) => toggleStar(file, e)}
                                            className={`p-1.5 rounded-full transition-all ${isStarred(file)
                                                ? 'text-[#FF9500]'
                                                : 'text-[#3f3f46] opacity-0 group-hover:opacity-100 hover:text-[#FF9500]'
                                                }`}
                                        >
                                            <Star size={14} fill={isStarred(file) ? "currentColor" : "none"} />
                                        </button>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-right">
                                            <div className="inline-flex p-1.5 bg-white/[0.04] rounded text-[#52525b] hover:text-white transition-colors">
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
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" />

                    <div className="relative z-10 bg-[#111113] w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-3xl flex flex-col overflow-hidden animate-fade-up border border-white/[0.06]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                {getFileIcon(previewFile.name, 'file')}
                                <div>
                                    <h3 className="font-bold text-white text-sm tracking-tight">{previewFile.name}</h3>
                                    <p className="text-[10px] text-[#52525b] font-mono font-bold uppercase tracking-wider">{(previewFile.size! / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => toggleStar(previewFile, e)}
                                    className={`p-2 rounded-lg transition-colors ${isStarred(previewFile) ? 'text-[#FF9500] bg-white/[0.04]' : 'text-[#a1a1aa] hover:bg-white/[0.04]'}`}
                                    title={isStarred(previewFile) ? "Unstar" : "Star"}
                                >
                                    <Star size={18} fill={isStarred(previewFile) ? "currentColor" : "none"} />
                                </button>
                                <a
                                    href={`https://raw.githubusercontent.com/ciizerr/vlc-discord-rpc-archive/main/${previewFile.path.join('/')}`}
                                    target="_blank"
                                    download
                                    className="p-2 hover:bg-white/[0.04] rounded-lg transition-colors text-[#a1a1aa]"
                                >
                                    <Download size={18} />
                                </a>
                                <button onClick={closePreview} className="p-2 hover:bg-white/[0.04] rounded-lg transition-colors text-[#a1a1aa]">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-auto bg-[#0d0d0f] p-0 relative min-h-[300px]">
                            {isLoadingPreview ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-[#FF9500]" size={32} />
                                </div>
                            ) : previewContent ? (
                                previewContent.startsWith('http') ? (
                                    <div className="flex items-center justify-center h-full p-8">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewContent} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                                    </div>
                                ) : (
                                    <CodeViewer code={previewContent} language={previewFile.name.split('.').pop() || 'text'} />
                                )
                            ) : (
                                <div className="flex items-center justify-center h-full text-[#52525b]">
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
