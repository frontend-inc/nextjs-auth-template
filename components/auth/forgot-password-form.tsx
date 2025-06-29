"use client"

import { forgotPasswordAction } from "@/app/actions"
import { SubmitButton } from "@/components/submit-button"
import { FormMessage } from "@/components/form-message"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import OtpVerificationForm from "./otp-verification-form"

type ForgotPasswordFormProps = {
  onBackToLogin: () => void
  onSuccess?: () => void
}

export default function ForgotPasswordForm({ onBackToLogin, onSuccess }: ForgotPasswordFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [email, setEmail] = useState<string>("")
  const [step, setStep] = useState<"email" | "otp">("email")

  const handleSubmit = async (formData: FormData) => {
    try {
      setError(null)
      const emailValue = formData.get("email") as string
      setEmail(emailValue)
      
      // Add a flag to indicate this is a client-side request
      formData.append("_client", "true")
      
      const result = await forgotPasswordAction(formData)
      
      if (result && 'error' in result) {
        setError(result.message || 'Password reset failed')
        setSuccess(null)
        return
      }
      
      if (result && 'success' in result) {
        setSuccess(result.message || 'Check your email for the recovery code')
        setError(null)
        setStep("otp")
      }
    } catch (e) {
      setError('An unexpected error occurred')
      setSuccess(null)
      console.error(e)
    }
  }

  if (step === "otp") {
    return (
      <OtpVerificationForm 
        email={email} 
        type="recovery" 
        onBack={() => setStep("email")}
        onSuccess={onSuccess}
      />
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          name="email" 
          id="email" 
          placeholder="you@example.com" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {error && <FormMessage variant="error">{error}</FormMessage>}
      {success && <FormMessage variant="success">{success}</FormMessage>}

      <div className="flex flex-col gap-2">
        <SubmitButton pendingText="Sending recovery code..." className="w-full">
          Send Recovery Code
        </SubmitButton>
        
        <button 
          type="button" 
          onClick={onBackToLogin}
          className="text-sm text-center text-muted-foreground hover:text-foreground underline mt-2"
        >
          Back to login
        </button>
      </div>
    </form>
  )
}