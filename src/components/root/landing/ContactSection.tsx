"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, Loader2, MapPin, Phone, Mail, Clock } from "lucide-react";
import BlurVignette from "@/components/ui/blur-vignette";
import { useTranslations } from "next-intl";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, amount: 0.3 });

  const t = useTranslations("contact");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      console.log("Form submitted:", { name, email, message });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t("info.visit.title"),
      content: t("info.visit.address"),
    },
    {
      icon: Mail,
      title: t("info.email.title"),
      content: t("info.email.address"),
    },
    {
      icon: Clock,
      title: t("info.hours.title"),
      content: t("info.hours.schedule"),
    },
  ];

  return (
    <section className="from-background to-secondary/10 relative w-full overflow-hidden bg-gradient-to-b py-20 md:py-32">
      {/* Background Elements */}
      <div
        className="absolute top-0 left-0 h-96 w-96 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)`,
        }}
      />
      <div
        className="absolute right-0 bottom-0 h-80 w-80 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--accent)), transparent 70%)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="from-foreground via-foreground/90 to-foreground/80 mb-6 bg-gradient-to-r bg-clip-text font-mono text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            {t("title")}
            <span className="from-primary to-secondary/70 block bg-gradient-to-r bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-muted-foreground font-serif text-xl text-balance md:text-2xl">
            {t("description")}
          </p>
        </motion.div>

        <div className="border-border/40 from-card/60 to-card/20 mx-auto max-w-6xl overflow-hidden rounded-3xl border bg-gradient-to-br shadow-2xl backdrop-blur-sm">
          <div className="grid lg:grid-cols-2">
            {/* Contact Form */}
            <div className="p-8 md:p-12" ref={formRef}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
              >
                <h3 className="text-foreground mb-2 font-sans text-3xl font-bold">
                  {t("form.title")}
                </h3>
                <p className="text-muted-foreground font-serif text-balance">
                  {t("form.subtitle")}
                </p>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="name">{t("form.name")}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("form.namePlaceholder")}
                      required
                      className="bg-background/50 backdrop-blur-sm"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="email">{t("form.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("form.emailPlaceholder")}
                      required
                      className="bg-background/50 backdrop-blur-sm"
                    />
                  </motion.div>
                </div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="message">{t("form.message")}</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("form.messagePlaceholder")}
                    required
                    className="bg-background/50 h-32 resize-none backdrop-blur-sm"
                  />
                </motion.div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      {t("form.sending")}
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : isSubmitted ? (
                    <>
                      <span>{t("form.sent")}</span>
                      <Check className="mr-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      {t("form.send")}
                      <Mail />
                    </>
                  )}
                </Button>
              </motion.form>
            </div>

            {/* Contact Info & Studio Image */}
            <div className="from-primary/10 to-primary/5 relative bg-gradient-to-br p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                }
                transition={{ duration: 0.5, delay: 0.5 }}
                className="h-full"
              >
                <h3 className="text-foreground mb-8 text-2xl font-bold">
                  {t("info.title")}
                </h3>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="bg-primary/20 flex size-12 items-center justify-center rounded-xl p-4">
                          <IconComponent className="text-primary size-8" />
                        </div>
                        <div>
                          <h4 className="text-foreground font-semibold">
                            {info.title}
                          </h4>
                          <p className="text-muted-foreground text-sm whitespace-pre-line">
                            {info.content}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
