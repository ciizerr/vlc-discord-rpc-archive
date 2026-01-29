import { getRepoContent, FileNode } from '@/lib/explorer';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default async function ArchivePage({ params }: { params: Promise<{ path?: string[] }> }) {
    const resolvedParams = await params;
    const currentPath = resolvedParams.path || [];

    const content = await getRepoContent(currentPath);

    const isFile = typeof content === 'string';

    // Helper to guess language
    const getLanguage = (filename: string) => {
        if (filename.endsWith('.js')) return 'javascript';
        if (filename.endsWith('.ts')) return 'typescript';
        if (filename.endsWith('.json')) return 'json';
        if (filename.endsWith('.cpp') || filename.endsWith('.wh.cpp')) return 'cpp';
        if (filename.endsWith('.h')) return 'cpp';
        if (filename.endsWith('.css')) return 'css';
        if (filename.endsWith('.md')) return 'markdown';
        return 'text';
    };

    return (
        <div className="min-h-screen p-8 pt-32 max-w-7xl mx-auto font-sans">
            <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500 font-mono">
                <Link href="/archive" className="hover:text-white transition-colors">root</Link>
                {currentPath.map((segment, i) => (
                    <span key={i} className="flex gap-2 items-center">
                        <span>/</span>
                        <Link href={`/archive/${currentPath.slice(0, i + 1).join('/')}`} className="hover:text-white transition-colors">
                            {segment}
                        </Link>
                    </span>
                ))}
            </div>

            <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/40 shadow-xl backdrop-blur-sm">
                {isFile ? (
                    <div className="text-sm">
                        <div className="flex items-center justify-between p-3 bg-zinc-900 border-b border-zinc-800 text-zinc-400">
                            <span className="font-mono text-xs">{currentPath[currentPath.length - 1]}</span>
                            <span className="text-xs uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 font-bold">
                                {getLanguage(currentPath[currentPath.length - 1] || '')}
                            </span>
                        </div>
                        {content.startsWith('[Binary File') ? (
                            <div className="p-12 text-center text-zinc-500 italic">
                                {content}
                            </div>
                        ) : (
                            <SyntaxHighlighter
                                language={getLanguage(currentPath[currentPath.length - 1] || '')}
                                style={oneDark}
                                customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                                showLineNumbers={true}
                                lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#52525b' }}
                            >
                                {content as string}
                            </SyntaxHighlighter>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-800/50">
                        <div className="bg-zinc-900/50 p-3 grid grid-cols-[auto_1fr] gap-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                            <span className="w-6 text-center">T</span>
                            <span>Name</span>
                        </div>
                        {(content as FileNode[]).map(node => (
                            <Link
                                key={node.name}
                                href={`/archive/${node.path.join('/')}`}
                                className="flex items-center p-3 hover:bg-zinc-800/80 transition-colors group"
                            >
                                <span className="mr-3 text-xl opacity-60 group-hover:opacity-100 w-6 text-center">
                                    {node.type === 'dir' ? '📂' : '📄'}
                                </span>
                                <span className={`flex-1 font-mono text-sm ${node.type === 'dir' ? 'font-bold text-blue-400 group-hover:underline' : 'text-zinc-300'}`}>
                                    {node.name}
                                </span>
                                {node.type === 'file' && (
                                    <span className="text-xs text-zinc-600 group-hover:text-zinc-500">
                                        View Code
                                    </span>
                                )}
                            </Link>
                        ))}
                        {(content as FileNode[]).length === 0 && (
                            <div className="p-12 text-center text-zinc-500">Empty Directory</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
