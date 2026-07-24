"use client";

import { motion } from "framer-motion";

export default function LiveBackground({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-[120px]"
        style={{ backgroundImage: `url(${imageUrl})` }}
        animate={{
          scale: [1.1, 1.3, 1.1],
          rotate: [0, 1, -1, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
