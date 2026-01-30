import { getRepoContent, FileNode } from "@/lib/explorer";
import Link from "next/link";

export default async function RepoExplorer() {
    const rootContent = await getRepoContent([]); // Get root
    const nodes = rootContent as FileNode[];

    // Let's recursively flatten a bit or just show root?
    // User asked for "Archive (Source Code)". Showing just root folders is cleaner.
    // Or maybe we can fetch `node-source/v1.0.0/index.js` specifically to show code?
    // Let's sticky to a "File Tree" view of the root for now, with a terminal aesthetic.

    // Hack: Let's actually show the `node-source` folder content by default if possible, or just root.
    // Root is better to show the breadth.

    return (
        <div className="h-[500px] w-full bg-[#0d1117] rounded-xl border border-slate-800 overflow-hidden flex flex-col font-mono text-sm shadow-2xl">
            {/* Terminal Title Bar */}
            <div className="bg-[#161b22] px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="ml-4 text-slate-500 text-xs">vlc-discord-rpc-archive — -bash</div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                <div className="text-slate-400 mb-4">$ ls -la ./archive</div>

                <div className="grid gap-1">
                    {nodes.map((node) => (
                        <div key={node.name} className="flex items-center gap-3 hover:bg-white/5 p-1 rounded cursor-pointer group">
                            <span className="text-slate-600">{node.type === 'dir' ? 'd' : '-'}rwxr-xr-x</span>
                            <span className="text-slate-500 text-xs w-16 text-right">{node.size || 4096}</span>
                            <span className="text-slate-500 text-xs w-20">Feb 29 12:00</span>
                            <Link
                                href={`/archive/${node.path.join('/')}`}
                                className={`${node.type === 'dir' ? 'text-blue-400 font-bold' : 'text-slate-200'} group-hover:underline`}
                            >
                                {node.name}
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="text-slate-400 mt-4 animate-pulse">
                    <span className="text-green-500">➜</span> <span className="text-blue-400">~</span> <span className="inline-block w-2 H-4 bg-slate-400 align-middle"></span>
                </div>
            </div>
        </div>
    );
}
