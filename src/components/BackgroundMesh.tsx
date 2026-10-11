import React from 'react';

export const BackgroundMesh: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Top subtle dynamic brand glow orb */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand/15 rounded-full blur-[130px] animate-pulse-subtle transition-colors duration-500" />

      {/* Floating secondary accent orbs */}
      <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-brand-gradient/10 rounded-full blur-[140px] animate-float-slow transition-colors duration-500" />
      <div className="absolute top-2/3 -right-32 w-[600px] h-[500px] bg-brand/10 rounded-full blur-[150px] animate-float-slow [animation-delay:3s] transition-colors duration-500" />
      
      {/* Background subtle micro-grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-70" />
    </div>
  );
};
