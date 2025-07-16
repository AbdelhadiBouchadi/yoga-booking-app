'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import CountUp from '../CountUp';
import { useTranslations } from 'next-intl';

const testimonials = [
  {
    name: 'Emma Thompson',
    role: 'Marketing Manager',
    content:
      'This studio has completely transformed my relationship with stress and anxiety. The instructors create such a safe, welcoming space for growth.',
    rating: 5,
    image:
      'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=200',
    class: 'Vinyasa Flow',
  },
  {
    name: 'David Kim',
    role: 'Software Engineer',
    content:
      'As someone who sits at a desk all day, yoga here has been a game-changer for my posture, flexibility, and mental clarity. Highly recommend!',
    rating: 5,
    image:
      'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=200',
    class: 'Hatha Yoga',
  },
  {
    name: 'Maria Santos',
    role: 'Teacher',
    content:
      'The prenatal classes helped me stay connected to my body during pregnancy. Luna is an incredible instructor with such gentle wisdom.',
    rating: 5,
    image:
      'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=200',
    class: 'Prenatal Yoga',
  },
  {
    name: 'James Wilson',
    role: 'Entrepreneur',
    content:
      'I was skeptical about yoga at first, but the philosophy and breathwork have genuinely changed how I approach challenges in business and life.',
    rating: 5,
    image:
      'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=200',
    class: 'Yin Yoga',
  },
  {
    name: 'Sophie Chen',
    role: 'Artist',
    content:
      'The meditation sessions have unlocked a new level of creativity for me. This place feels like a sanctuary in the busy city.',
    rating: 5,
    image:
      'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=200',
    class: 'Meditation',
  },
  {
    name: 'Alex Rodriguez',
    role: 'Healthcare Worker',
    content:
      'After long shifts, the restorative classes help me decompress and reconnect with myself. The community here is so supportive.',
    rating: 5,
    image:
      'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=200',
    class: 'Restorative',
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const t = useTranslations('testimonials');

  const testimonials = [
    {
      name: t('reviews.emma.name'),
      role: t('reviews.emma.role'),
      content: t('reviews.emma.content'),
      rating: 5,
      image:
        'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=200',
      class: t('reviews.emma.class'),
    },
    {
      name: t('reviews.david.name'),
      role: t('reviews.david.role'),
      content: t('reviews.david.content'),
      rating: 5,
      image:
        'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=200',
      class: t('reviews.david.class'),
    },
    {
      name: t('reviews.maria.name'),
      role: t('reviews.maria.role'),
      content: t('reviews.maria.content'),
      rating: 5,
      image:
        'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=200',
      class: t('reviews.maria.class'),
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-secondary/10 to-background py-20">
      {/* Background Elements */}
      <div
        className="absolute right-1/4 top-1/4 h-80 w-80 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)`,
        }}
      />

      <div
        className="container relative z-10 mx-auto px-4 md:px-6"
        ref={sectionRef}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl font-mono py-2">
            {t('title')}
            <span className="block bg-gradient-to-r from-primary to-primary/30 bg-clip-text text-transparent py-1">
              {t('titleHightlight')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground md:text-2xl font-serif">
            {t('description')}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                duration: 0.6,

                ease: 'easeOut',
              }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card/60 to-card/20 p-6 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100" />

              {/* Quote Icon */}
              <div className="relative z-10">
                <Quote className="mb-4 h-8 w-8 text-primary/60" />

                {/* Rating */}
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="mb-6 text-muted-foreground leading-relaxed font-quote">
                  "{testimonial.content}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground font-sans">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground font-serif">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-primary font-medium font-serif">
                      {testimonial.class}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <div className="mx-auto rounded-3xl border border-border/40 bg-gradient-to-br from-card/60 to-card/20 p-8 backdrop-blur-sm md:p-12 font-sans">
            <div className="grid gap-8 text-center md:grid-cols-3">
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">
                  <CountUp
                    from={0}
                    to={500}
                    separator=","
                    direction="up"
                    duration={1}
                  />
                  +
                </div>
                <div className="text-muted-foreground">
                  {t('stats.happyStudents')}
                </div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">
                  <CountUp
                    from={0}
                    to={4.9}
                    separator=","
                    direction="up"
                    duration={1}
                  />
                </div>
                <div className="text-muted-foreground">
                  {t('stats.averageRating')}
                </div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">
                  <CountUp
                    from={0}
                    to={1000}
                    separator=","
                    direction="up"
                    duration={1}
                  />
                  +
                </div>
                <div className="text-muted-foreground">
                  {t('stats.classesCompleted')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
