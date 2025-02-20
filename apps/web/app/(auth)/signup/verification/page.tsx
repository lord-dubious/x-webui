"use client"
import React, { Suspense } from 'react'
import OtpVerification from './OtpVerification'

const OTPVerificationpage = () => {
  return (
<Suspense fallback={<div>Loading....</div>}>
<OtpVerification />
</Suspense>
  )
}

export default OTPVerificationpage
