'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, amount: 0.3 });

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-secondary/15 to-foreground/45">
      {/* Ambient Background Elements */}
      <div
        className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--accent)), transparent 70%)`,
        }}
      />

      <div
        className="container relative z-10 mx-auto px-4 md:px-6"
        ref={heroRef}
      >
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mx-auto max-w-4xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={
                isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }
              }
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/40 bg-primary/10 dark:bg-secondary/10 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              Find Your Inner Peace
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Transform Your
              <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Mind & Body
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground md:text-2xl"
            >
              Join our serene yoga community and discover the perfect balance
              between strength, flexibility, and mindfulness. Book your
              transformative session today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <Button
                asChild
                size="lg"
                className="group relative overflow-hidden bg-primary text-primary-foreground"
              >
                <Link href="/book-session">
                  <Calendar className="mr-2 h-5 w-5 " />
                  Book Your Session
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border/40 bg-background/50 backdrop-blur-sm"
              >
                <Link href="/classes">
                  <Heart className="mr-2 h-5 w-5" />
                  Explore Classes
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-32 left-10 hidden lg:block"
          >
            <div className="rounded-2xl border border-border/20 bg-card/50 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">
                  500+ Happy Yogis
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-32 right-10 hidden lg:block"
          >
            <div className="rounded-2xl border border-border/20 bg-card/50 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">
                  Expert Instructors
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
