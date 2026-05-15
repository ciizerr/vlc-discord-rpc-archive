import { getLatestSourceCode } from "@/lib/source-reader";
import CodeViewer from "@/components/CodeViewer";

export default async function RepoExplorer() {
    const sourceData = await getLatestSourceCode();

    if (!sourceData) {
        return (
            <div className="h-[200px] w-full bg-[#111113] rounded-xl border border-white/[0.06] flex items-center justify-center text-[#52525b]">
                Source code not found.
            </div>
        );
    }

    return (
        <div className="w-full bg-[#0d0d0f] rounded-xl border border-white/[0.06] overflow-hidden flex flex-col font-mono text-sm shadow-2xl">
            {/* Terminal Title Bar */}
            <div className="bg-[#111113] px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2 shrink-0">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                </div>
                <div className="ml-4 text-[#52525b] text-xs truncate">
                    windhawk-source/{sourceData.version}/{sourceData.filename} — C++
                </div>
            </div>

            {/* Code Content */}
            <CodeViewer code={sourceData.code} language="cpp" />
        </div>
    );
}
