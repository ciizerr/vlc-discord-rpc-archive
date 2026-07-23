import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function MediaNavigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-gradient-to-b from-black/80 to-transparent pt-4 pb-12 pointer-events-none">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between pointer-events-auto">
        <Link 
          href="/"
          className="flex items-center gap-3 text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium hidden sm:inline">Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <Image
            src="/assets/vlc-discord-icon.png"
            alt="VLC Discord RPC"
            width={32}
            height={32}
            className="rounded"
          />
          <span className="font-semibold text-lg tracking-tight text-white drop-shadow-md">
            VLC RPC
          </span>
        </div>
      </div>
    </header>
  );
}
