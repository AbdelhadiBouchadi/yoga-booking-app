'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { navItems } from '@/lib/data';
import { ModeToggle } from '@/components/ui/theme-toggle';
import { authClient } from '@/lib/auth-client';
import { Button, buttonVariants } from '@/components/ui/button';
import UserDropdown, { UserDropdownSkeleton } from './UserDropdown';
import { usePathname } from 'next/navigation';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  Variants,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { LeafIcon, LogInIcon, Menu, X } from 'lucide-react';
import LogoGreen from '../../../public/logo-green.webp';
import LogoOrange from '../../../public/logo-orange.webp';
import { useTheme } from 'next-themes';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';

const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0,
    x: '100%',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
      staggerChildren: 0.1,
    },
  },
};

const mobileItemVariants = {
  closed: { opacity: 0, x: 20 },
  open: { opacity: 1, x: 0 },
};

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const { theme } = useTheme();
  const t = useTranslations('nav');
  const locale = useLocale();

  const isRouteActive = (href: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    return href === '/'
      ? pathWithoutLocale === '/'
      : pathWithoutLocale.startsWith(href);
  };

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className="sticky inset-x-0 top-0 z-50 w-full"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Desktop Navigation */}
      <motion.div
        animate={{
          backdropFilter: visible ? 'blur(10px)' : 'none',
          boxShadow: visible
            ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
            : 'none',
          width: visible ? '70%' : '100%',
          y: visible ? 20 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 50,
        }}
        style={{
          minWidth: '800px',
        }}
        className={cn(
          'relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-6 py-3 lg:flex',
          visible && ' border border-border/50'
        )}
      >
        {/* Logo */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link href="/" className="relative z-20 flex items-center space-x-2">
            <Image
              src={theme === 'light' ? LogoGreen : LogoOrange}
              alt="Yoga Studio Logo"
              width={48}
              height={48}
            />
          </Link>
        </motion.div>

        {/* Navigation Items */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onMouseLeave={() => setHovered(null)}
          className="absolute inset-0 flex flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium"
        >
          {navItems.map((item, idx) => {
            const isActive = isRouteActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={`nav-${idx}`}
                href={item.href}
                onMouseEnter={() => setHovered(idx)}
                className={cn(
                  'relative px-4 py-2 flex items-center gap-2',
                  isActive ? 'text-foreground ' : 'hover:text-foreground'
                )}
              >
                {(hovered === idx || isActive) && (
                  <motion.div
                    layoutId="hovered"
                    className={cn(
                      'absolute inset-0 h-full w-full rounded-full',
                      isActive ? 'bg-primary' : 'bg-primary/30'
                    )}
                  />
                )}
                <Icon size={16} className="relative z-20" />
                <span className="relative z-20">{t(item.name)}</span>
              </Link>
            );
          })}
        </motion.div>

        {/* Right Side Actions */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center space-x-2"
        >
          <ModeToggle />
          <LocaleSwitcher variant="desktop" />
          {isPending ? (
            <UserDropdownSkeleton />
          ) : session ? (
            <UserDropdown
              email={session.user.email}
              name={session.user.name}
              image={session.user.image}
              isLoading={isPending}
            />
          ) : (
            <Button asChild className="z-20">
              <Link href="/sign-in">
                {t('signIn')}
                <LogInIcon className="ml-2 size-4" />
              </Link>
            </Button>
          )}
        </motion.div>
      </motion.div>

      {/* Mobile Navigation */}
      <motion.div
        animate={{
          backdropFilter: visible ? 'blur(10px)' : 'none',
          boxShadow: visible
            ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
            : 'none',
          width: visible ? '90%' : '100%',
          paddingRight: visible ? '12px' : '0px',
          paddingLeft: visible ? '12px' : '0px',
          borderRadius: visible ? '16px' : '0px',
          y: visible ? 20 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 50,
        }}
        className={cn(
          'relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-4 py-3 lg:hidden',
          visible && 'bg-background/80 border border-border/50'
        )}
      >
        {/* Mobile Header */}
        <div className="flex w-full flex-row items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={theme === 'light' ? LogoGreen : LogoOrange}
              alt="Yoga Studio Logo"
              width={48}
              height={48}
            />
          </Link>

          <div className="flex items-center space-x-2">
            <ModeToggle />
            {isPending ? (
              <UserDropdownSkeleton />
            ) : session ? (
              <UserDropdown
                email={session.user.email}
                name={session.user.name}
                image={session.user.image}
                isLoading={isPending}
              />
            ) : null}
            <motion.button
              className="rounded-lg p-2 text-foreground transition-colors duration-200 hover:bg-accent dark:hover:bg-sidebar lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variants={mobileItemVariants}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-background/20 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.div
                className="fixed right-4 top-16 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl lg:hidden"
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="space-y-6 p-6">
                  <div className="space-y-1">
                    {navItems.map((item, idx) => {
                      const isActive = isRouteActive(item.href);
                      const Icon = item.icon;

                      return (
                        <motion.div
                          key={item.name}
                          variants={mobileItemVariants}
                        >
                          <Link
                            key={`mobile-nav-${idx}`}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                            )}
                          >
                            <Icon size={18} />
                            {t(item.name)}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.div
                    className="space-y-3 border-t border-border pt-6"
                    variants={mobileItemVariants}
                  >
                    {!session ? (
                      <Link
                        href="/sign-in"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          buttonVariants({ variant: 'default', size: 'sm' }),
                          'w-full justify-center'
                        )}
                      >
                        {t('signIn')}
                        <LogInIcon className="ml-2 size-4" />
                      </Link>
                    ) : (
                      <Link
                        href="/sign-in"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          buttonVariants({ variant: 'default', size: 'sm' }),
                          'w-full justify-center'
                        )}
                      >
                        {t('bookSession')}
                        <LeafIcon className="ml-2 size-4" />
                      </Link>
                    )}
                    <LocaleSwitcher
                      variant="mobile"
                      onLocaleChange={() => setMobileMenuOpen(false)}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Navbar;
