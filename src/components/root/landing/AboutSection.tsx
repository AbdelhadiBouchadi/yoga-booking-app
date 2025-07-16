'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Flower2Icon, Heart, Users, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

const values = [
  {
    title: 'Mindfulness',
    description:
      'Cultivate present-moment awareness through guided meditation and breathing techniques.',
    icon: Flower2Icon,
  },
  {
    title: 'Community',
    description:
      'Join a supportive community of like-minded individuals on their wellness journey.',
    icon: Users,
  },
  {
    title: 'Wellness',
    description:
      'Achieve holistic health through the perfect balance of physical and mental practices.',
    icon: Heart,
  },
  {
    title: 'Growth',
    description:
      'Embrace continuous personal development and spiritual awakening in every session.',
    icon: Zap,
  },
];

export default function AboutSection() {
  const t = useTranslations('about');
  const aboutRef = useRef(null);
  const valuesRef = useRef(null);

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 });

  const values = [
    {
      title: t('values.mindfulness.title'),
      description: t('values.mindfulness.description'),
      icon: Flower2Icon,
    },
    {
      title: t('values.community.title'),
      description: t('values.community.description'),
      icon: Users,
    },
    {
      title: t('values.wellness.title'),
      description: t('values.wellness.description'),
      icon: Heart,
    },
    {
      title: t('values.growth.title'),
      description: t('values.growth.description'),
      icon: Zap,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-background to-secondary/10 py-20 md:py-32">
      {/* Ambient Background */}
      <div
        className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)`,
        }}
      />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Header Section */}
        <motion.div
          ref={aboutRef}
          initial={{ opacity: 0, y: 30 }}
          animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <h2 className="mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl font-mono">
            {t('title')}
            <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground md:text-2xl font-serif">
            {t('description')}
          </p>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="mb-24 grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={
              aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/50 to-card/20 p-8 backdrop-blur-sm md:p-10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
                <Flower2Icon className="h-8 w-8 text-primary" />
              </div>

              <h3 className="mb-4 bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-3xl font-bold text-transparent font-sans">
                {t('mission.title')}
              </h3>

              <p className="text-lg leading-relaxed text-muted-foreground font-serif">
                {t('mission.description')}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/50 to-card/20 p-8 backdrop-blur-sm md:p-10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/30 to-secondary/10">
                <Heart className="h-8 w-8 text-foreground" />
              </div>

              <h3 className="mb-4 text-3xl font-bold text-foreground font-sans">
                {t('vision.title')}
              </h3>

              <p className="text-lg leading-relaxed text-muted-foreground font-serif">
                {t('vision.description')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <div ref={valuesRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-12 text-center"
          >
            <h3 className="mb-4 bg-gradient-to-r from-foreground/80 via-foreground to-foreground/80 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl font-mono">
              {t('values.title')}
            </h3>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-serif">
              {t('values.description')}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value, index) => {
              const IconComponent = value.icon;

              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{
                    duration: 0.6,
                    ease: 'easeOut',
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card/60 to-card/20 p-6 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 transition-transform duration-300 group-hover:scale-110">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>

                    <h4 className="mb-3 text-xl font-semibold text-foreground font-sans">
                      {value.title}
                    </h4>

                    <p className="text-sm leading-relaxed text-muted-foreground font-serif">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
