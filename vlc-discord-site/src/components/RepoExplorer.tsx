import { getLatestSourceCode } from "@/lib/source-reader";
import CodeViewer from "@/components/CodeViewer";
import { Folder, FileCode, GitBranch, Info, Globe, Shield } from "lucide-react";

export default async function RepoExplorer() {
    const sourceData = await getLatestSourceCode();

    if (!sourceData) {
        return (
            <div className="h-[300px] w-full bg-[#0d0d0f] rounded-xl border border-white/[0.06] flex items-center justify-center text-[#52525b]">
                Source code not available.
            </div>
        );
    }

    return (
        <div className="w-full bg-[#0d0d0f] rounded-2xl border border-white/[0.08] overflow-hidden flex flex-col shadow-[0_24px_48px_rgba(0,0,0,0.4)] transition-all duration-500 hover:border-white/[0.12]">
            {/* IDE-style Header */}
            <div className="bg-[#111113] border-b border-white/[0.08] px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-6">
                    {/* Window Controls */}
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]/80 hover:bg-[#ff5f57] transition-colors shadow-inner"></div>
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]/80 hover:bg-[#febc2e] transition-colors shadow-inner"></div>
                        <div className="w-3 h-3 rounded-full bg-[#28c840]/80 hover:bg-[#28c840] transition-colors shadow-inner"></div>
                    </div>

                    {/* Breadcrumbs */}
                    <div className="hidden md:flex items-center gap-2 text-[11px] font-medium text-[#52525b]">
                        <Folder size={12} />
                        <span>windhawk-source</span>
                        <span className="text-white/10">/</span>
                        <span className="text-[#a1a1aa]">{sourceData.version}</span>
                        <span className="text-white/10">/</span>
                        <span className="text-white">{sourceData.filename}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.03] border border-white/[0.05] text-[10px] font-bold text-[#FF9500]/80">
                        <GitBranch size={10} />
                        <span>main</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.03] border border-white/[0.05] text-[10px] font-bold text-[#5865F2]/80">
                        <Globe size={10} />
                        <span>{sourceData.version}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 min-h-[500px]">
                {/* Side Bar (Simulated Explorer) */}
                <div className="hidden lg:flex w-64 bg-[#09090b] border-r border-white/[0.08] flex-col py-4 px-3 shrink-0">
                    <div className="text-[10px] font-bold text-[#3f3f46] uppercase tracking-widest mb-4 px-2">
                        Explorer
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-[#a1a1aa] font-medium bg-white/[0.03] text-white">
                            <Folder size={14} className="text-[#FF9500]" />
                            <span>{sourceData.version}</span>
                        </div>
                        <div className="ml-4 pl-4 border-l border-white/[0.05] space-y-1">
                            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-white font-medium bg-[#FF9500]/10 text-[#FF9500] border border-[#FF9500]/20">
                                <FileCode size={14} />
                                <span className="truncate">{sourceData.filename}</span>
                            </div>
                            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-[#52525b] hover:text-[#a1a1aa] transition-colors cursor-not-allowed italic">
                                <FileCode size={14} />
                                <span>modreadme.md</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto space-y-4 pt-4 border-t border-white/[0.05]">
                        <div className="flex items-center gap-2 px-2 text-[11px] text-[#52525b]">
                            <Shield size={12} />
                            <span>Verified Source</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 text-[11px] text-[#52525b]">
                            <Info size={12} />
                            <span>Native C++</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col bg-[#0d0d0f] min-w-0">
                    {/* Tab Bar */}
                    <div className="bg-[#111113] border-b border-white/[0.08] flex shrink-0">
                        <div className="flex items-center gap-2.5 px-4 py-2 border-r border-white/[0.08] bg-[#0d0d0f] border-t-2 border-t-[#FF9500]">
                            <FileCode size={14} className="text-[#FF9500]" />
                            <span className="text-[12px] font-semibold text-white tracking-tight">{sourceData.filename}</span>
                        </div>
                    </div>

                    {/* Code Content */}
                    <div className="flex-1 overflow-hidden relative">
                        <CodeViewer code={sourceData.code} language="cpp" />
                    </div>
                </div>
            </div>

            {/* Footer / Status Bar */}
            <div className="bg-[#111113] border-t border-white/[0.08] px-4 py-1.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#52525b]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#28c840] animate-pulse"></div>
                        <span>Synced with Repository</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#52525b]">
                        <span>UTF-8</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-[10px] font-medium text-[#52525b]">
                        C++
                    </div>
                    <div className="text-[10px] font-medium text-[#FF9500]">
                        Build passing
                    </div>
                </div>
            </div>
        </div>
    );
}
