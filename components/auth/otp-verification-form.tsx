"use client"

import { verifyOtpAction } from "@/app/actions"
import { SubmitButton } from "@/components/submit-button"
import { FormMessage } from "@/components/form-message"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

type OtpVerificationFormProps = {
  email: string
  type?: "email" | "recovery"
  onBack: () => void
  onSuccess?: () => void
}

export default function OtpVerificationForm({ 
  email, 
  type = "email", 
  onBack, 
  onSuccess 
}: OtpVerificationFormProps) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    try {
      // Add our collected OTP to the form data
      formData.append("token", otp)
      formData.append("email", email)
      formData.append("type", type)
      formData.append("_client", "true")
      
      const result = await verifyOtpAction(formData)
      
      if (result && 'error' in result) {
        setError(result.message || 'Verification failed')
        return
      }
      
      if (result && 'success' in result) {
        // Reload the page or redirect
        if (onSuccess) {
          onSuccess()
        } else {
          window.location.href = "/protected"
        }
      }
    } catch (e) {
      setError('An unexpected error occurred')
      console.error(e)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <InputOTP 
          maxLength={6} 
          value={otp} 
          onChange={setOtp}
          containerClassName="justify-center"
          id="otp"
          name="otp"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>
      </div>

      {error && <FormMessage variant="error">{error}</FormMessage>}

      <div className="flex flex-col gap-2">
        <SubmitButton 
          pendingText="Verifying..." 
          className="w-full"
          disabled={otp.length !== 6}
        >
          Verify Code
        </SubmitButton>
        
        <button 
          type="button" 
          onClick={onBack}
          className="text-sm text-center text-muted-foreground hover:text-foreground underline mt-2"
        >
          Back
        </button>
      </div>
    </form>
  )
}