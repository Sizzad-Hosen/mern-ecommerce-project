"use client"
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return <div>Token: {token}</div>;
};

export default function ResetPasswordWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
