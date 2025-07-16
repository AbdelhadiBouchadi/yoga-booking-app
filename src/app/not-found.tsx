import Lightning from '@/components/root/Lightning';
import React from 'react';

export default function NotFound() {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center relative text-4xl">
      <Lightning hue={220} xOffset={1} speed={1} intensity={1} size={1} />
      <h1 className="font-bold text-4xl md:text-7xl absolute translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 text-white uppercase">
        Coming Soon
      </h1>
    </div>
  );
}
