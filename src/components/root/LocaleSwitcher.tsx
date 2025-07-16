'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

interface LocaleSwitcherProps {
  variant?: 'desktop' | 'mobile';
  onLocaleChange?: () => void;
}

export function LocaleSwitcher({
  variant = 'desktop',
  onLocaleChange,
}: LocaleSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  const handleLocaleChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
    onLocaleChange?.();
  };

  const currentLocale = locales.find((l) => l.code === locale);

  if (variant === 'mobile') {
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Language</h4>
        <div className="grid grid-cols-2 gap-2">
          {locales.map((loc) => (
            <Button
              key={loc.code}
              variant={locale === loc.code ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleLocaleChange(loc.code)}
              className={cn(
                'justify-start gap-2 text-sm',
                locale === loc.code && 'bg-primary text-primary-foreground'
              )}
            >
              <span className="text-base">{loc.flag}</span>
              {loc.name}
              {locale === loc.code && <Check className="ml-auto h-4 w-4" />}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="z-20">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full flex items-center justify-center"
        >
          <Globe className="size-8 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 space-y-2">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc.code}
            onClick={() => handleLocaleChange(loc.code)}
            className={cn(
              'flex items-center gap-3 cursor-pointer',
              locale === loc.code && 'bg-accent'
            )}
          >
            <span className="text-base">{loc.flag}</span>
            <span className="flex-1">{loc.name}</span>
            {locale === loc.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
