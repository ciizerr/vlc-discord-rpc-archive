"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Images } from "lucide-react";

export default function MediaGallery({ backdrops }: { backdrops: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!backdrops || backdrops.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 py-8">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-6xl max-h-[85vh] w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <Image
                src={selectedImage}
                alt="Media Backdrop Still"
                fill
                className="object-contain"
                priority
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-3 bg-black/60 hover:bg-black/90 rounded-full text-white transition-all border border-white/10"
                aria-label="Close image"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2.5 mb-6">
        <Images size={20} className="text-amber-400" />
        <h2 className="text-2xl font-bold text-white tracking-tight">Stills & Backdrops</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {backdrops.map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            onClick={() => setSelectedImage(src)}
            className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-white/10 group cursor-pointer shadow-lg"
          >
            <Image
              src={src}
              alt={`Media still ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 text-white">
                <Maximize2 size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
