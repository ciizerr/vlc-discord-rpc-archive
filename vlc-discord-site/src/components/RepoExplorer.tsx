import { getLatestSourceCode } from "@/lib/source-reader";
import CodeViewer from "@/components/CodeViewer";

export default async function RepoExplorer() {
    const sourceData = await getLatestSourceCode();

    if (!sourceData) {
        return (
            <div className="h-[200px] w-full bg-slate-50 dark:bg-[#0d1117] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500">
                Source code not found.
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-50 dark:bg-[#0d1117] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col font-mono text-sm shadow-2xl transition-colors duration-300">
            {/* Terminal Title Bar */}
            <div className="bg-slate-200 dark:bg-[#161b22] px-4 py-2 border-b border-slate-300 dark:border-slate-800 flex items-center gap-2 transition-colors duration-300 shrink-0">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="ml-4 text-slate-600 dark:text-slate-500 text-xs truncate">
                    windhawk-source/{sourceData.version}/{sourceData.filename} — C++
                </div>
            </div>

            {/* Code Content */}
            <CodeViewer code={sourceData.code} language="cpp" />
        </div>
    );
}
