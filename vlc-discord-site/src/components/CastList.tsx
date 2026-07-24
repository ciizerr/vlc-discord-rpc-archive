"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Users, Clapperboard, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CastMember {
  id: string;
  name: string;
  character: string;
  profilePath: string | null;
}

interface CrewMember {
  id: string;
  name: string;
  job: string;
  profilePath?: string | null;
}

interface CastListProps {
  cast: CastMember[];
  directors?: CrewMember[];
  source?: 'tmdb' | 'tvmaze';
}

export default function CastList({ cast, directors = [], source = 'tmdb' }: CastListProps) {
  const castScrollRef = useRef<HTMLDivElement>(null);
  const crewScrollRef = useRef<HTMLDivElement>(null);

  const [canCastLeft, setCanCastLeft] = useState(false);
  const [canCastRight, setCanCastRight] = useState(false);
  const [canCrewLeft, setCanCrewLeft] = useState(false);
  const [canCrewRight, setCanCrewRight] = useState(false);

  const checkCastScroll = useCallback(() => {
    const el = castScrollRef.current;
    if (!el) return;
    setCanCastLeft(el.scrollLeft > 5);
    setCanCastRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  const checkCrewScroll = useCallback(() => {
    const el = crewScrollRef.current;
    if (!el) return;
    setCanCrewLeft(el.scrollLeft > 5);
    setCanCrewRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  useEffect(() => {
    const castEl = castScrollRef.current;
    const crewEl = crewScrollRef.current;

    checkCastScroll();
    checkCrewScroll();

    if (castEl) castEl.addEventListener("scroll", checkCastScroll, { passive: true });
    if (crewEl) crewEl.addEventListener("scroll", checkCrewScroll, { passive: true });
    window.addEventListener("resize", checkCastScroll, { passive: true });
    window.addEventListener("resize", checkCrewScroll, { passive: true });

    return () => {
      if (castEl) castEl.removeEventListener("scroll", checkCastScroll);
      if (crewEl) crewEl.removeEventListener("scroll", checkCrewScroll);
      window.removeEventListener("resize", checkCastScroll);
      window.removeEventListener("resize", checkCrewScroll);
    };
  }, [checkCastScroll, checkCrewScroll]);

  const handleCastScroll = (direction: 'left' | 'right') => {
    if (!castScrollRef.current) return;
    const scrollAmount = castScrollRef.current.clientWidth * 0.75;
    castScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleCrewScroll = (direction: 'left' | 'right') => {
    if (!crewScrollRef.current) return;
    const scrollAmount = crewScrollRef.current.clientWidth * 0.75;
    crewScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!cast.length && !directors.length) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 py-10 space-y-12">
      {/* Directors & Creators Section */}
      {directors.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <Clapperboard size={20} className="text-amber-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Creators & Director</h2>
          </div>

          <div className="relative group/carousel">
            <AnimatePresence>
              {canCrewLeft && (
                <motion.button
                  key="crew-left"
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => handleCrewScroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 text-white backdrop-blur-md shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {canCrewRight && (
                <motion.button
                  key="crew-right"
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => handleCrewScroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 text-white backdrop-blur-md shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            <div 
              ref={crewScrollRef}
              className="flex gap-6 overflow-x-auto pb-4 pt-4 -mt-3 snap-x scrollbar-none scroll-smooth items-start px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {directors.map((person, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex flex-col items-center text-center shrink-0 w-28 sm:w-32 group cursor-pointer snap-start"
                >
                  <Link href={`/person/${source}/${person.id}`} className="flex flex-col items-center w-full">
                    <motion.div 
                      whileHover={{ y: -8, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-zinc-900 mb-3 shadow-md border border-white/10 group-hover:border-amber-400/50 group-hover:shadow-2xl shrink-0"
                    >
                      {person.profilePath ? (
                        <Image
                          src={person.profilePath}
                          alt={person.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 112px, 128px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                          <User size={36} />
                        </div>
                      )}
                    </motion.div>

                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-0.5">
                      {person.job}
                    </span>
                    <h3 
                      title={person.name}
                      className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors leading-tight truncate group-hover:whitespace-normal group-hover:overflow-visible w-full"
                    >
                      {person.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cast Section */}
      {cast.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <Users size={20} className="text-amber-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Cast</h2>
            <span className="text-xs font-medium text-zinc-500">({cast.length})</span>
          </div>

          <div className="relative group/carousel">
            <AnimatePresence>
              {canCastLeft && (
                <motion.button
                  key="cast-left"
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => handleCastScroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 text-white backdrop-blur-md shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {canCastRight && (
                <motion.button
                  key="cast-right"
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => handleCastScroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 text-white backdrop-blur-md shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            <div
              ref={castScrollRef}
              className="flex gap-6 overflow-x-auto pb-4 pt-4 -mt-3 snap-x scrollbar-none scroll-smooth px-1 items-start"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {cast.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                  className="flex flex-col items-center text-center shrink-0 w-28 sm:w-32 group cursor-pointer snap-start"
                >
                  <Link href={`/person/${source}/${person.id}`} className="flex flex-col items-center w-full">
                    <motion.div 
                      whileHover={{ y: -8, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-zinc-900 mb-3 shadow-md border border-white/10 group-hover:border-amber-400/50 group-hover:shadow-2xl shrink-0"
                    >
                      {person.profilePath ? (
                        <Image
                          src={person.profilePath}
                          alt={person.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 112px, 128px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                          <User size={36} />
                        </div>
                      )}
                    </motion.div>

                    <h3 
                      title={person.name}
                      className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors leading-tight mb-0.5 truncate group-hover:whitespace-normal group-hover:overflow-visible w-full"
                    >
                      {person.name}
                    </h3>
                    <p 
                      title={person.character}
                      className="text-[11px] text-zinc-400 truncate group-hover:whitespace-normal group-hover:overflow-visible w-full font-medium"
                    >
                      {person.character}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
