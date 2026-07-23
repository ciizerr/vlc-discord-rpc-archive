

export default function MediaFooter() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-white/5 bg-black">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <p>
          &copy; {new Date().getFullYear()} VLC Discord RPC. All rights reserved.
        </p>
        
        <div className="flex items-center gap-6">
          <p className="flex items-center gap-1.5">
            Data provided by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-400 hover:text-white transition-colors">TMDb</a>
          </p>
          <p className="flex items-center gap-1.5">
            Data provided by <a href="https://www.tvmaze.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-400 hover:text-white transition-colors">TVMaze</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
