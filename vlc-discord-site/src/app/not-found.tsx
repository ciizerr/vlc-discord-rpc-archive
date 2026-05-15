import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden font-sans">
            <div className="relative z-10 p-6 flex flex-col items-center text-center">
                <div className="flex flex-col items-center max-w-md w-full">
                    <h1 className="text-8xl font-black text-[#FF9500] mb-2">
                        404
                    </h1>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-[#a1a1aa] mb-8 leading-relaxed text-[15px]">
                        The page you are looking for doesn&apos;t exist or has been moved.
                    </p>

                    <Link
                        href="/"
                        className="group px-6 py-3 bg-[#FF9500] hover:bg-[#e68600] text-[#09090b] rounded-md font-semibold text-[14px] flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Return Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
