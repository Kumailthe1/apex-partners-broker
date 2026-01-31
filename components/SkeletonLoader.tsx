'use client';

import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-effect rounded-xl p-4 sm:p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

export function SkeletonButton() {
  return <Skeleton className="h-10 w-24" />;
}

export function SkeletonInput() {
  return <Skeleton className="h-10 w-full" />;
}

export function SkeletonSelect() {
  return <Skeleton className="h-10 w-full" />;
}

