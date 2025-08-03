"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Users, Mail, Phone, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { PublicInstructorDetailType } from "@/app/data/instructors/get-instructors";
import { RenderDescription } from "@/components/admin/rich-text-editor/RenderDescription";
import ImageModalSlider from "./image-modal-slider";

interface InstructorDetailPageProps {
  instructor: NonNullable<PublicInstructorDetailType>;
}

export default function InstructorDetailPage({
  instructor,
}: InstructorDetailPageProps) {
  const t = useTranslations("instructorDetail");
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, amount: 0.3 });
  const locale = useLocale();
  const isFrench = locale === "fr";

  // Parse description JSON for RenderDescription component
  const descriptionJson = useMemo(() => {
    try {
      const desc = isFrench
        ? instructor.descriptionFr
        : instructor.descriptionEn;
      return desc ? JSON.parse(desc) : null;
    } catch (e) {
      console.error("Failed to parse instructor description JSON:", e);
      return null;
    }
  }, [instructor.descriptionEn, instructor.descriptionFr, isFrench]);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  return (
    <div className="from-background via-secondary/15 to-foreground/45 min-h-screen bg-gradient-to-br">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32" ref={heroRef}>
        <div className="container mx-auto px-4 md:px-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button variant="ghost" asChild>
              <Link href={`/${locale}/instructors`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToInstructors")}
              </Link>
            </Button>
          </motion.div>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Instructor Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
              }
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative h-96 overflow-hidden rounded-3xl lg:h-[500px]">
                <Image
                  src={
                    instructor.image ||
                    "/placeholder.svg?height=500&width=400&query=yoga instructor" ||
                    "/placeholder.svg"
                  }
                  alt={instructor.name}
                  className="h-full w-full object-cover"
                  width={400}
                  height={500}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
            {/* Instructor Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h1 className="mb-4 font-mono text-4xl font-bold md:text-5xl">
                  {instructor.name}
                </h1>
                {/* Rating and Stats */}
                <div className="mb-6 flex items-center gap-6">
                  {instructor.averageRating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          {instructor.averageRating}
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        ({instructor.totalReviews} {t("reviews")})
                      </span>
                    </div>
                  )}
                  {instructor.experience && (
                    <Badge variant="secondary" className="text-sm">
                      {instructor.experience} {t("yearsExperience")}
                    </Badge>
                  )}
                </div>
                {/* Description using RenderDescription */}
                {descriptionJson && (
                  <div className="mb-6">
                    <RenderDescription json={descriptionJson} />
                  </div>
                )}
              </div>
              {/* Contact Info */}
              <div className="space-y-3">
                {instructor.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="text-primary h-5 w-5" />
                    <span className="text-muted-foreground">
                      {instructor.email}
                    </span>
                  </div>
                )}
                {instructor.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="text-primary h-5 w-5" />
                    <span className="text-muted-foreground">
                      {instructor.phone}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      {instructor.images && instructor.images.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="mb-4 font-mono text-3xl font-bold">
                {t("gallery")} {/* Add 'gallery' to your translation file */}
              </h2>
              <p className="text-muted-foreground">
                {t("galleryDescription")}{" "}
                {/* Add 'galleryDescription' to your translation file */}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {instructor.images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                  onClick={() => openImageModal(index)} // Open modal on click
                >
                  <Image
                    src={
                      image ||
                      "/placeholder.svg?height=400&width=600&query=yoga instructor gallery"
                    }
                    alt={`Instructor image ${index + 1}`}
                    width={600}
                    height={400}
                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-sm font-semibold text-white">
                      {t("viewImage")}{" "}
                      {/* Add 'viewImage' to your translation file */}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specialties and Certifications */}
      <section className="py-16">
        <div className="mx-auto w-full px-4 md:px-6">
          <div className="">
            {/* Specialties */}
            {instructor.specialties && instructor.specialties.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="text-primary h-5 w-5" />
                      {t("specialties")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {instructor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {/* Certifications
            {instructor.certifications &&
              instructor.certifications.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="text-primary h-5 w-5" />
                        {t("certifications")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {instructor.certifications.map((cert) => (
                          <Badge key={cert} variant="outline">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )} */}
          </div>
        </div>
      </section>
      <AnimatePresence>
        {showImageModal &&
          instructor.images &&
          instructor.images.length > 0 && (
            <ImageModalSlider
              images={instructor.images}
              initialIndex={selectedImageIndex}
              onClose={closeImageModal}
            />
          )}
      </AnimatePresence>
    </div>
  );
}
