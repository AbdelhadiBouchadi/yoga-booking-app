import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background/40 flex min-h-svh flex-col items-center justify-center p-6 md:p-10 font-sans">
      <div className="w-full max-w-sm md:max-w-5xl">{children}</div>
    </div>
  );
};

export default AuthLayout;
