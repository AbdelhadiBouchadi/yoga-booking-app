"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, Calendar } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ClassesSection() {
  const t = useTranslations("classes");
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const classes = [
    {
      title: t("types.hatha.title"),
      description: t("types.hatha.description"),
      duration: t("types.hatha.duration"),
      level: t("types.hatha.level"),
      capacity: t("types.hatha.capacity"),
      rating: 4.9,
      price: t("types.hatha.price"),
      image:
        "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600",
      gradient: "from-primary/20 to-secondary-500/5",
    },
    {
      title: t("types.vinyasa.title"),
      description: t("types.vinyasa.description"),
      duration: t("types.vinyasa.duration"),
      level: t("types.vinyasa.level"),
      capacity: t("types.vinyasa.capacity"),
      rating: 4.8,
      price: t("types.vinyasa.price"),
      image:
        "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600",
      gradient: "from-primary/20 to-secondary-500/5",
    },
    {
      title: t("types.yin.title"),
      description: t("types.yin.description"),
      duration: t("types.yin.duration"),
      level: t("types.yin.level"),
      capacity: t("types.yin.capacity"),
      rating: 5.0,
      price: t("types.yin.price"),
      image:
        "https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=600",
      gradient: "from-primary/20 to-secondary-500/5",
    },
  ];

  return (
    <section className="from-secondary/10 to-background relative w-full overflow-hidden bg-gradient-to-b py-20 md:py-32">
      {/* Background Elements */}
      <div
        className="absolute top-1/4 right-0 h-80 w-80 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)`,
        }}
      />

      <div
        className="relative z-10 container mx-auto px-4 md:px-6"
        ref={sectionRef}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="from-foreground via-foreground/90 to-foreground/80 mb-6 bg-gradient-to-r bg-clip-text font-mono text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            {t("title")}
            <span className="from-primary to-primary/70 block bg-gradient-to-r bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-muted-foreground font-serif text-xl md:text-2xl">
            {t("description")}
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
                ease: "easeInOut",
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group border-border/40 from-card/60 to-card/20 relative overflow-hidden rounded-3xl border bg-gradient-to-br backdrop-blur-sm"
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
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary/90 text-secondary-foreground backdrop-blur-sm">
                    {yogaClass.price}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="mb-3 flex items-center justify-between font-sans">
                  <h3 className="text-foreground text-2xl font-bold">
                    {yogaClass.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-muted-foreground text-sm font-medium">
                      {yogaClass.rating}
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 font-serif">
                  {yogaClass.description}
                </p>

                {/* Class Details */}
                <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="text-primary h-4 w-4" />
                    <span className="text-muted-foreground">
                      {yogaClass.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-primary h-4 w-4" />
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
                    className="bg-primary text-primary-foreground w-full font-sans"
                  >
                    <Link
                      href={`/book-class/${yogaClass.title.toLowerCase().replace(" ", "-")}`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {t("bookClass")}
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
              <Link href="/classes">{t("viewAll")}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
