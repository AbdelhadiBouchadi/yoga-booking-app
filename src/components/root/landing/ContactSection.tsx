'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Check,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Clock,
  MailIcon,
} from 'lucide-react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, amount: 0.3 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      console.log('Form submitted:', { name, email, message });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Studio',
      content: 'Meknes, Morocco',
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+212-697830605',
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'contact@lafabriquedubonheur.com',
    },
    {
      icon: Clock,
      title: 'Studio Hours',
      content: 'Mon-Fri: 6AM-9PM\nSat-Sun: 7AM-7PM',
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-background to-secondary/10 py-20 md:py-32">
      {/* Background Elements */}
      <div
        className="absolute left-0 top-0 h-96 w-96 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--accent)), transparent 70%)`,
        }}
      />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Connect With
            <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Our Community
            </span>
          </h2>
          <p className="text-xl text-muted-foreground md:text-2xl">
            Have questions about our classes or want to start your yoga journey?
            We're here to guide you every step of the way.
          </p>
        </motion.div>

        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/60 to-card/20 shadow-2xl backdrop-blur-sm">
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
                <h3 className="mb-2 text-3xl font-bold text-foreground">
                  Send us a message
                </h3>
                <p className="text-muted-foreground">
                  We'd love to hear from you and help you begin your wellness
                  journey.
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
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
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
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your yoga goals or any questions you have..."
                    required
                    className="h-32 resize-none bg-background/50 backdrop-blur-sm"
                  />
                </motion.div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      Sending...
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : isSubmitted ? (
                    <>
                      <span>Message Sent!</span>
                      <Check className="mr-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Send Message
                      <MailIcon />
                    </>
                  )}
                </Button>
              </motion.form>
            </div>

            {/* Contact Info & Studio Image */}
            <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                }
                transition={{ duration: 0.5, delay: 0.5 }}
                className="h-full"
              >
                <h3 className="mb-8 text-2xl font-bold text-foreground">
                  Get in Touch
                </h3>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <motion.div
                        key={info.title}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {info.title}
                          </h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {info.content}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Studio Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.9 }
                  }
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mt-8 overflow-hidden rounded-2xl"
                >
                  <img
                    src="https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Yoga Studio Interior"
                    className="h-48 w-full object-cover"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
