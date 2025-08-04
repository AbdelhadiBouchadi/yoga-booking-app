"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function SubQuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full items-center justify-center py-20 md:py-24"
    >
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-muted-foreground font-quote text-2xl leading-relaxed italic md:text-3xl lg:text-4xl">
            {"We’re all just walking each other home"}
          </p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-foreground mt-6 font-mono text-lg font-semibold md:text-xl"
          >
            — Ram Dass
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
