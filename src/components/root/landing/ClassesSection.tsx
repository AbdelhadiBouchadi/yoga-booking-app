'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, Calendar } from 'lucide-react';
import Link from 'next/link';

const classes = [
  {
    title: 'Hatha Yoga',
    description:
      'Perfect for beginners, focusing on basic postures and breathing techniques to build foundation and flexibility.',
    duration: '60 min',
    level: 'Beginner',
    capacity: '12 people',
    rating: 4.9,
    price: '$25',
    image:
      'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-primary/20 to-seconday-500/5',
  },
  {
    title: 'Vinyasa Flow',
    description:
      'Dynamic sequences that synchronize breath with movement, creating a meditative flow of energy and strength.',
    duration: '75 min',
    level: 'Intermediate',
    capacity: '15 people',
    rating: 4.8,
    price: '$30',
    image:
      'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-primary/20 to-seconday',
  },
  {
    title: 'Yin Yoga',
    description:
      'Slow-paced practice with longer holds, promoting deep relaxation and inner stillness for mind and body.',
    duration: '90 min',
    level: 'All Levels',
    capacity: '10 people',
    rating: 5.0,
    price: '$35',
    image:
      'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-primary/20 to-seconday',
  },
];

export default function ClassesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-secondary/10 to-background py-20 md:py-32">
      {/* Background Elements */}
      <div
        className="absolute right-0 top-1/4 h-80 w-80 rounded-full opacity-5 blur-3xl"
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
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Discover Your
            <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Perfect Practice
            </span>
          </h2>
          <p className="text-xl text-muted-foreground md:text-2xl">
            From gentle beginnings to advanced flows, find the class that
            resonates with your journey and current needs.
          </p>
        </motion.div>

        {/* Classes Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((yogaClass, index) => (
            <motion.div
              key={yogaClass.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-sm"
            >
              {/* Card Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${yogaClass.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={yogaClass.image}
                  alt={yogaClass.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Price Badge */}
                <div className="absolute right-4 top-4">
                  <Badge className="bg-primary/90 text-secondary-foreground backdrop-blur-sm">
                    {yogaClass.price}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground">
                    {yogaClass.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {yogaClass.rating}
                    </span>
                  </div>
                </div>

                <p className="mb-4 text-muted-foreground">
                  {yogaClass.description}
                </p>

                {/* Class Details */}
                <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      {yogaClass.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      {yogaClass.capacity}
                    </span>
                  </div>
                  <div>
                    <Badge variant="secondary" className="text-xs">
                      {yogaClass.level}
                    </Badge>
                  </div>
                </div>

                {/* Action Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    asChild
                    className="w-full bg-primary text-primary-foreground"
                  >
                    <Link
                      href={`/book-class/${yogaClass.title.toLowerCase().replace(' ', '-')}`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Book This Class
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border/40 bg-background/50 backdrop-blur-sm"
            >
              <Link href="/classes">View All Classes</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
