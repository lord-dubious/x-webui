"use client"
import React, { Suspense } from 'react'
import PasswordReset from './passwordReset'

const PasswordResetPage = () => {
  return (
<Suspense fallback={<div>Loading....</div>}>
<PasswordReset />
</Suspense>
  )
}

export default PasswordResetPage
