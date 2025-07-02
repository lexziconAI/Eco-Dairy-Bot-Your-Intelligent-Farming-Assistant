import React from 'react';

interface ChartCaptionProps {
  children: React.ReactNode;
}

export default function ChartCaption({ children }: ChartCaptionProps) {
  return (
    <p className="mt-2 text-xs text-gray-500 leading-snug max-w-prose">
      {children}
    </p>
  );
}