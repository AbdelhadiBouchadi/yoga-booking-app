"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Share2,
  Instagram,
  ExternalLink,
  Facebook,
  Twitter,
  Youtube,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "Instagram",
    href: "https://instagram.com/lafabriquedubonheur",
    icon: Instagram,
    color: "hover:text-pink-500",
  },
  {
    name: "LinkTree",
    href: "https://linktr.ee/lafabriquedubonheur",
    icon: ExternalLink,
    color: "hover:text-green-500",
  },
  {
    name: "Email",
    href: "mailto:contact@lafabriquedubonheur.co",
    icon: Mail,
    color: "hover:text-orange-500",
  },
];

interface SocialDropdownProps {
  variant?: "desktop" | "mobile";
  onLinkClick?: () => void;
}

export default function SocialDropdown({
  variant = "desktop",
  onLinkClick,
}: SocialDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("nav");

  const handleLinkClick = () => {
    setIsOpen(false);
    onLinkClick?.();
  };

  if (variant === "mobile") {
    return (
      <div className="space-y-3">
        <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Share2 className="h-4 w-4" />
          {t("followUs")}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className={cn(
                  "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center gap-2 rounded-lg border p-3 text-center",
                  social.color,
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{social.name}</span>
              </motion.a>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn("z-20 size-10 rounded-full", isOpen && "bg-accent")}
      >
        <Share2 className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="border-border/50 bg-background/95 absolute top-full right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
            >
              <div className="p-4">
                <div className="text-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Share2 className="text-primary h-4 w-4" />
                  {t("followUs")}
                </div>

                <div className="space-y-1">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        className={cn(
                          "hover:bg-accent/50 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                          social.color,
                        )}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 4 }}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-muted-foreground hover:text-foreground transition-colors">
                          {social.name}
                        </span>
                        <ExternalLink className="text-muted-foreground/50 ml-auto h-3 w-3" />
                      </motion.a>
                    );
                  })}
                </div>

                <div className="border-border/50 mt-4 border-t pt-3">
                  <p className="text-muted-foreground text-center text-xs">
                    {t("stayConnected")}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
