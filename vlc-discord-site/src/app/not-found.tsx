import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DotGrid from '@/components/DotGrid';

export default function NotFound() {
    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden font-sans text-foreground selection:bg-orange-500/30">
            {/* Background Layer */}
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

            <div className="relative z-10 p-6 flex flex-col items-center text-center">
                <div className="p-12 rounded-3xl bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl flex flex-col items-center max-w-md w-full animate-in fade-in zoom-in duration-500">
                    <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-2 drop-shadow-sm">
                        404
                    </h1>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        Oops! The page you are looking for seems to have wandered off into the void.
                    </p>

                    <Link
                        href="/"
                        className="group px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-orange-500/20"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Return Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
