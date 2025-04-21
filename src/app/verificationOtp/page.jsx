

"use client"

import React, { Suspense } from 'react';
import OtpVerification from '@/components/VerificationOtp';

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtpVerification />
      </Suspense>
    </div>
  );
};

export default Page;
