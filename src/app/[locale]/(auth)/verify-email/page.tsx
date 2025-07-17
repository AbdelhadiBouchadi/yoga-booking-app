import VerifyEmail from '@/components/auth/VerifyEmail';
import RippleWaveLoader from '@/components/ui/ripple-wave-loader';
import React, { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<RippleWaveLoader />}>
      <VerifyEmail />
    </Suspense>
  );
}
