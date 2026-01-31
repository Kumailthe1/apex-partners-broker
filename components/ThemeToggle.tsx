'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // Avoid hydration mismatch by rendering a stable placeholder until mounted.
  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background/60 text-foreground backdrop-blur transition-colors',
          className
        )}
        aria-label="Toggle theme"
        disabled
      >
        <Moon className="h-5 w-5" />
      </button>
    );
  }

  const isDark = (theme ?? 'dark') === 'dark';
  // Show the *target* mode icon:
  // - Light mode -> show Moon (click to go Dark)
  // - Dark mode -> show Sun (click to go Light)
  const Icon = isDark ? Sun : Moon;
  const nextTheme = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background/60 text-foreground backdrop-blur transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}


