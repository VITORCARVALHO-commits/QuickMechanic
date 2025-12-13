import React from 'react';

export const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 w-full',
    circle: 'h-12 w-12 rounded-full',
    card: 'h-32 w-full rounded-lg',
    text: 'h-4 w-3/4',
    title: 'h-8 w-1/2',
    button: 'h-10 w-24 rounded-md'
  };

  return (
    <div className={`skeleton bg-gray-200 dark:bg-gray-700 rounded ${variants[variant]} ${className}`} />
  );
};

export const SkeletonCard = () => (
  <div className="card-elevated p-6 space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton variant="circle" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="title" />
        <Skeleton variant="text" />
      </div>
    </div>
    <Skeleton variant="card" />
    <div className="flex gap-3">
      <Skeleton variant="button" />
      <Skeleton variant="button" />
    </div>
  </div>
);

export const SkeletonList = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
