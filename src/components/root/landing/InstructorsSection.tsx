'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Award, Heart } from 'lucide-react';
import BlurVignette from '@/components/ui/blur-vignette';
import Image from 'next/image';

const instructors = [
  {
    name: 'Sarah Chen',
    title: 'Lead Instructor & Founder',
    specialties: ['Vinyasa', 'Meditation', 'Breathwork'],
    experience: '12 years',
    rating: 4.9,
    bio: 'Sarah discovered yoga during a transformative journey in India and has been sharing its healing power ever since.',
    image:
      'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400',
    certifications: ['RYT-500', 'Meditation Teacher'],
  },
  {
    name: 'Marcus Rodriguez',
    title: 'Senior Instructor',
    specialties: ['Hatha', 'Yin Yoga', 'Philosophy'],
    experience: '8 years',
    rating: 4.8,
    bio: 'Marcus brings a grounded approach to yoga, emphasizing alignment and the deeper philosophical teachings.',
    image:
      'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400',
    certifications: ['RYT-200', 'Yin Yoga Certified'],
  },
  {
    name: 'Luna Patel',
    title: 'Wellness Coach',
    specialties: ['Restorative', 'Prenatal', 'Ayurveda'],
    experience: '6 years',
    rating: 5.0,
    bio: 'Luna specializes in creating safe, nurturing spaces for healing and personal growth through gentle practices.',
    image:
      'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
    certifications: ['RYT-200', 'Prenatal Yoga', 'Ayurveda Practitioner'],
  },
];

export default function InstructorsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-background to-secondary/10 py-20 md:py-32">
      {/* Background Elements */}
      <div
        className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full opacity-5 blur-3xl"
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
          className="mx-auto mb-16 max-w-3xl text-center space-y-4"
        >
          <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Meet Your
            <span className="block bg-gradient-to-r from-primary to-primary/30 bg-clip-text text-transparent py-3">
              Guiding Teachers
            </span>
          </h2>
          <p className="text-xl text-muted-foreground md:text-2xl">
            Our experienced instructors are here to support you on every step of
            your yoga journey with wisdom, compassion, and expertise.
          </p>
        </motion.div>

        {/* Instructors Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor, index) => (
            <motion.div
              key={instructor.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: 'easeOut',
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <BlurVignette inset="20px" transitionLength="120px" blur="40px">
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width={200}
                    height={200}
                  />
                </BlurVignette>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute right-4 top-4">
                  <div className="flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium text-foreground">
                      {instructor.rating}
                    </span>
                  </div>
                </div>

                {/* Experience Badge */}
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                    {instructor.experience} experience
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="mb-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    {instructor.name}
                  </h3>
                  <p className="text-primary font-medium">{instructor.title}</p>
                </div>

                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  {instructor.bio}
                </p>

                {/* Specialties */}
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">
                    Specialties
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="secondary"
                        className="text-xs"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="border-t border-border/20 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-semibold text-foreground">
                      Certifications
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {instructor.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center w-full"
        >
          <div className="mx-auto rounded-2xl border border-border/40 bg-gradient-to-br from-card/60 to-card/20 p-8 backdrop-blur-sm">
            <Heart className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-4 text-2xl font-bold text-foreground">
              Ready to Begin Your Journey?
            </h3>
            <p className="text-muted-foreground">
              Our teachers are here to guide you with personalized attention and
              genuine care for your growth.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
