"use client";

import { useState } from "react";
import Image from "next/image";
import { User, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CastMember {
  id: string;
  name: string;
  character: string;
  profilePath: string | null;
}

export default function CastList({ cast }: { cast: CastMember[] }) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 12;

  if (!cast || cast.length === 0) return null;

  const displayedCast = showAll ? cast : cast.slice(0, INITIAL_COUNT);
  const hasMore = cast.length > INITIAL_COUNT;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h2 className="text-2xl font-bold mb-6">Top Cast</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <AnimatePresence>
          {displayedCast.map((person) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col group cursor-default"
            >
              <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-zinc-800/50 mb-3 shadow-md border border-white/5 group-hover:border-white/20 transition-colors">
                {person.profilePath ? (
                  <Image
                    src={person.profilePath}
                    alt={person.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                    <User size={40} className="text-zinc-600" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-sm leading-tight mb-1">{person.name}</h3>
              <p className="text-xs text-zinc-400">{person.character}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show Full Cast ({cast.length}) <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
