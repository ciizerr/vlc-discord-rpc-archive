import { getRepoContent } from '@/lib/explorer';
import CodeViewer from '@/components/CodeViewer';
import Link from 'next/link';
import { Download, ArrowLeft } from 'lucide-react';
import DriveClient from '@/components/DriveClient';
import DotGrid from '@/components/DotGrid';

// --- Background Layer ---
const Background = () => (
    <div className="fixed inset-0 z-0 pointer-events-none">
        <DotGrid
            dotSize={30}
            gap={40}
            proximity={500}
            shockRadius={50}
            shockStrength={10}
            resistance={750}
            returnDuration={2}
        />
    </div>
);

export default async function ArchivePage({ params }: { params: Promise<{ path?: string[] }> }) {
    const resolvedParams = await params;
    const currentPath = resolvedParams.path || [];

    // --- Standard Structure ---
    // If currentPath is empty, we are at root.
    // If currentPath exists, we fetch.
    let content;
    if (currentPath.length > 0) {
        content = await getRepoContent(currentPath);
    }

    // --- Directory Handling (Nested) ---
    if (Array.isArray(content)) {
        // It's a folder, render DriveClient with this folder's content
        return (
            <div className="h-screen w-full overflow-hidden relative flex flex-col font-sans">
                <Background />
                <div className="relative z-10 flex-1 pt-24 pb-6 px-6 max-w-7xl mx-auto w-full flex flex-col min-h-0">
                    <DriveClient
                        currentPath={currentPath}
                        folderContent={content}
                    />
                </div>
            </div>
        );
    }

    // --- Detail View (Single File) ---
    // Only reach here if content is a string (file)
    if (typeof content === 'string') {
        const filename = currentPath[currentPath.length - 1];

        // Image Check
        const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(filename.split('.').pop()?.toLowerCase() || '');

        if (isImage) {
            const rawUrl = `https://raw.githubusercontent.com/ciizerr/vlc-discord-rpc-archive/main/${currentPath.join('/')}`;
            return (
                <div className="h-screen w-full overflow-hidden relative flex flex-col font-sans">
                    <Background />
                    <div className="relative z-10 flex-1 flex flex-col pt-24 pb-8 px-6 max-w-7xl mx-auto w-full">
                        <div className="mb-6 flex-shrink-0">
                            <Link href="/archive" className="flex items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors text-sm font-medium">
                                <ArrowLeft size={16} /> Back to Drive
                            </Link>
                        </div>
                        <div className="flex-1 min-h-0 p-8 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto">
                            <div className="relative w-full max-w-3xl flex-shrink-0 aspect-video flex items-center justify-center bg-slate-100/50 dark:bg-slate-950/30 bg-[url('/assets/grid.svg')] bg-center rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                                <img src={rawUrl} alt={filename} className="max-w-full max-h-full object-contain shadow-md" />
                            </div>
                            <div className="mt-8 flex gap-4 flex-shrink-0">
                                <a href={rawUrl} download target="_blank" className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                                    <Download size={18} /> Download Original
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        const getLang = (N: string) => {
            if (N.endsWith('.js')) return 'javascript';
            if (N.endsWith('.ts') || N.endsWith('.tsx')) return 'typescript';
            if (N.endsWith('.json')) return 'json';
            if (N.endsWith('.cpp') || N.endsWith('.wh.cpp')) return 'cpp';
            return 'text';
        };

        return (
            <div className="h-screen w-full overflow-hidden relative flex flex-col font-sans">
                <Background />
                <div className="relative z-10 flex-1 flex flex-col pt-24 pb-8 px-6 max-w-7xl mx-auto w-full">
                    <div className="mb-6 flex-shrink-0">
                        <Link href="/archive" className="flex items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors text-sm font-medium">
                            <ArrowLeft size={16} /> Back to Drive
                        </Link>
                    </div>
                    <div className="flex-1 min-h-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                            <span className="font-mono text-sm text-slate-600 dark:text-slate-400 font-bold">{filename}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs uppercase font-bold text-slate-500 bg-slate-200/50 dark:bg-slate-800/50 px-2.5 py-1 rounded">Read Only</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-0">
                            {content.startsWith('[Binary File') ? (
                                <div className="p-20 text-center text-slate-500 italic">Binary File</div>
                            ) : (
                                <CodeViewer code={content} language={getLang(filename)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- Root View (Default) ---
    // If we are here, currentPath is empty (or failed).
    const [windhawkFiles, scriptFiles, assetFiles] = await Promise.all([
        getRepoContent(['windhawk-source']),
        getRepoContent(['node-source']),
        getRepoContent(['assets'])
    ]);

    return (
        <div className="h-screen w-full overflow-hidden relative flex flex-col font-sans">
            <Background />
            <div className="relative z-10 flex-1 pt-24 pb-6 px-6 max-w-7xl mx-auto w-full flex flex-col min-h-0">
                <DriveClient
                    rootData={{
                        windhawkFiles: Array.isArray(windhawkFiles) ? windhawkFiles : [],
                        scriptFiles: Array.isArray(scriptFiles) ? scriptFiles : [],
                        assetFiles: Array.isArray(assetFiles) ? assetFiles : []
                    }}
                />
            </div>
        </div>
    );
}
